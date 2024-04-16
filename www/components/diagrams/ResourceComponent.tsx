import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useState} from 'react';
import * as PIXI from 'pixi.js';
import {
    AnimatedSprite,
    Container,
    NineSlicePlane,
    PixiComponent,
    Sprite,
    Stage,
    Text,
    useApp,
    useTick
} from '@pixi/react';
import {DiagramObject, GlobalState, Resource, screen_to_isometric} from './util';
import {Assets, TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";
export interface ViewportProps {
    width: number
    height: number
    children?: React.ReactNode | any
}
export interface PixiComponentViewportProps extends ViewportProps {
    app: PIXI.Application
}

interface ResourceComponentState{
    loaded: boolean;
    frames?: PIXI.Texture[];
    count: number;
    yoffset: number;
}
interface ResourceComponentProps{
    resource: Resource;
    diagramObject: DiagramObject;
    onResourceInteraction?: (event: any) => void;
    globalState: GlobalState
}

const ResourceComponent = (props: ResourceComponentProps) => {
    const app = useApp();

    const [state, setState] =useState<ResourceComponentState>({
        loaded: false,
        count: 0,
        yoffset: 0
    });
    const spriteRef = createRef<PIXI.AnimatedSprite>();
    const refreshData = async () => {
        const sheet = await Assets.load(props.diagramObject.jsonSrc);
        const frames = Object.keys(sheet.data.frames).map(frame =>
            PIXI.Texture.from(frame)
        );
        setState({
            ...state,
            frames,
            loaded: true,
        });

    }

    useTick(delta => {
        if (props.resource.float) {
            // do something here
            const count = state.count + 0.01 * delta;
            const remainder = state.count % 1;
            const yoffset = Math.abs(remainder - .5);
            setState({
                ...state,
                count,
                yoffset
            });

        }
    })

    useEffect( () => {
        if(state.loaded) {
            return;
        }

        refreshData();

    })
    const onmouseover = () => {
        if(!spriteRef.current) {
            return;
        }
        spriteRef.current.filters = [new OutlineFilter(2, 0x99ff99)];
       /* setState({
            ...state,
            image: ResourceImages.FloorSelected
        })*/
    }
    const onmouseout = () => {
       /* setState({
            ...state,
            image: ResourceImages.Floor2
        })*/
        if(!spriteRef.current) {
            return;
        }
        spriteRef.current.filters = [];
    }
    const onClick = (event: any) => {
        if(!props.onResourceInteraction) {
            return ;
        }
        const newEvent = {
            ...event,
            resource: props.resource
        }
        props.onResourceInteraction(newEvent);
    }

    const [screenX, screenY] = screen_to_isometric(props.resource.x, props.resource.y);

    const style = new TextStyle({
        fill: 'white',
        fontFamily: "Merchant Copy",
        fontSize: 12
    });

    return (
        <>
            {
                state.frames &&
                <AnimatedSprite
                    ref={spriteRef}
                    interactive={true}
                    scale={{
                        x: props.resource?.scale?.x || 1,
                        y: props.resource?.scale?.y || 1
                    }}
                    anchor={{
                        x: props.resource.anchor?.x || .5,
                        y: props.resource.anchor?.y ||1.25
                    }}
                    height={state.frames[0].height * (props.resource.sizeMultiplier || 1)}
                    width={state.frames[0].width * (props.resource.sizeMultiplier || 1)}
                    textures={state.frames}
                    isPlaying={true}
                    initialFrame={Math.floor(Math.random() * state.frames.length)}
                    animationSpeed={0.2}
                    x={screenX} // + app.screen.width / 2} // center horizontally
                    y={screenY + (state.yoffset  * 32)} //  + app.screen.height / 4} // align the y axis to one fourth of the screen
                    onmouseover={onmouseover}
                    onmouseout={onmouseout}
                    onclick={onClick}
                />
            }
            {
                props.resource.name && <Text
                    text={props.resource.name}
                    x={screenX} // + app.screen.width / 2}
                    y={screenY - (spriteRef.current?.height || 0 )} // + app.screen.height / 4 }
                    anchor={{ x: 0.5, y: 1 }}
                    style={style}
                    onclick ={(event) => console.log("Event: ", event)}
                    resolution={8}
                />
            }
            {/*{
                props.resource._selected &&
                <>
                    <NineSlicePlane

                        anchor={new PIXI.Point(200, 100)}
                        pivot={new PIXI.Point(200, 100)}
                        leftWidth={50}
                        topHeight={30}
                        rightWidth={60}
                        bottomHeight={32}
                        width={200}
                        height={100}
                        x={screenX + app.screen.width / 2}
                        y={screenY - (128 || 0 ) + app.screen.height / 4 }
                        image="%PUBLIC_URL%/images/diagrams/thought-bubble1.png"
                    ></NineSlicePlane>
                    <Text
                        text={props.resource.notes || "ResourceComp"}
                        x={screenX + 10 + app.screen.width / 2}
                        y={screenY + 10 - (128 || 0 ) + app.screen.height / 4 }

                        pivot={new PIXI.Point(200, 100)}
                        style={new TextStyle({
                            fill: 'black',
                            fontFamily: "Pixel",
                            fontSize: 8,
                            padding: 40
                        })}
                        onclick ={(event) => console.log("Event: ", event)}
                    />
                </>
            }*/}

        </>
    );

}

export default ResourceComponent;