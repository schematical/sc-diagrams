import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
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
import {Viewport } from 'pixi-viewport'
import { matrix, multiply } from "mathjs";
// import axios from "axios";
import '@pixi/gif';

import {Block, DiagramObject, GlobalState, Notation, Resource, screen_to_isometric} from '../util';
import {Assets, TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";


interface SwimlaneLaneComponentState{
    loaded?: boolean;
    frames?: any;
}
interface SwimlaneLaneComponentProps{
   pos: Block;
   width?: number;
   height?: number;
   resource: Resource;
   diagramObject: DiagramObject;
   globalState: GlobalState


}

const SwimlaneLaneComponent = (props: SwimlaneLaneComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<SwimlaneLaneComponentState>({

    });
    const spriteRef = createRef<PIXI.NineSlicePlane>();
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
    const width = props.width || 200;
    return (
        <>
            {
                state.frames &&
                <AnimatedSprite
                    // ref={spriteRef}
                    interactive={true}
                    scale={{
                        x: props.resource?.scale?.x || 1,
                        y: props.resource?.scale?.y || 1
                    }}
                    anchor={{
                        x: props.resource.anchor?.x || .5,
                        y: props.resource.anchor?.y ||1.25
                    }}
                    textures={state.frames}
                    isPlaying={true}
                    initialFrame={0}
                    animationSpeed={0.1}
                    x={props.pos.x + width / 2}
                    y={props.pos.y}
                    onmouseover={onmouseover}
                    onmouseout={onmouseout}

                    // onclick={onClick}
                />
            }
            <NineSlicePlane

                ref={spriteRef}
                anchor={new PIXI.Point(0, 0)}
                pivot={new PIXI.Point(0, 0)}
                leftWidth={2}
                topHeight={2}
                rightWidth={2}
                bottomHeight={2}
                width={width}
                height={props.height || 800}
                x={props.pos.x}
                y={props.pos.y}
                image={process.env.PUBLIC_URL + "/images/diagrams/SwimlaneLaneRight.png"}
                // onclick={props.onClick}
                /*interactive={true}
                onmouseover={onmouseover}
                onmouseout={onmouseout}*/
            ></NineSlicePlane>
            {
                props.resource.name &&
                <Text
                    text={props.resource.name}
                    x={props.pos.x + width/2}
                    y={props.pos.y - 20}

                    anchor={new PIXI.Point(0.5, 0)}
                    style={new TextStyle({
                        fill: 'white',
                        fontFamily: "Pixel",
                        fontSize: 8,
                        padding: 40,
                        align: 'center',
                        wordWrap: true,
                        wordWrapWidth: width,
                    })}
                    interactive={false}

                    resolution={8}
                />
            }

        </>
    );

}

export default SwimlaneLaneComponent;