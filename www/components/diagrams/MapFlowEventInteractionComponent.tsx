import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useRef, useState} from 'react';
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

import {
    Block, Diagram,
    DiagramObject, FlowEvent, FlowEventInteraction, getResourceFromMapFlowEventId, GlobalState, DiagramFlow,
    Resource,
    FlowEventInteractionEvent,
    screen_to_isometric
} from './util';
import {Assets, DisplayObject, TextStyle} from "pixi.js";

interface MapFlowEventInteractionComponentState{
    mapFlowEventInteractionId?: string;
    loaded: boolean;
    frames?: any;
    count: number;
    startPos: Block;
    endPos: Block;
    speed: number;
    cycleCount: number;
}
interface MapFlowEventInteractionComponentProps{
    diagram: Diagram;
    mapFlow: DiagramFlow;
    diagramFlowEventInteraction: FlowEventInteraction
    diagramObject: DiagramObject;
    onMapFlowEventInteractionClick?: (event: FlowEventInteractionEvent) => void
    globalState: GlobalState;
    viewport: Viewport;
}

const MapFlowEventInteractionComponent = (props: MapFlowEventInteractionComponentProps) => {
    const app = useApp();
    const getRefreshedState = () => {
        const resource1 = getResourceFromMapFlowEventId(props.diagram, props.mapFlow, props.diagramFlowEventInteraction.event1);
        const resource2 = getResourceFromMapFlowEventId(props.diagram, props.mapFlow, props.diagramFlowEventInteraction.event2);
        if (!resource1 || !resource2) throw new Error("MapFlowEventInteractionComponent - Could not find resources in diagram");
        const [startX, startY] = screen_to_isometric(resource1.x, resource1.y);
        const [endX, endY] = screen_to_isometric(resource2.x, resource2.y);
        // console.log("POS CHANGE: ", props.mapFlowEventInteraction.id,  startX, ' / ', startY - 64,  ' -- ', endX, ' / ', endY);
        const newState: MapFlowEventInteractionComponentState = {
            ...state,
            count: 0,
            cycleCount: 0,
            mapFlowEventInteractionId: props.diagramFlowEventInteraction.id,
            startPos: {
                x: startX,
                y: startY - 64
            },
            endPos: {
                x: endX,
                y: endY - 64
            },
            speed: props.diagramFlowEventInteraction.payload?.speed || 0.01
        }
        return newState
    }

    const [state, setState] = useState<MapFlowEventInteractionComponentState>({
        loaded: false,
        count: 0,
        cycleCount: 0,
        startPos: {
            x: 0,
            y: 0
        },
        endPos: {
            x: 1,
            y: 1
        },
        speed: 0
    });
    const deltaX = state.startPos.x - state.endPos.x;
    const deltaY = state.startPos.y - state.endPos.y;
    const scale = state.count;
    const screenX = state.startPos.x - (scale * deltaX);
    const screenY = state.startPos.y - (scale * deltaY);
    useTick(delta => {

        if (props.globalState.playMode === "paused") {
            return;
        }
        /* if (spriteRef.current) {
            props.viewport.follow(spriteRef.current as DisplayObject);
        }*/
        props.viewport.moveCenter(
            screenX, //  + app.screen.width / 2,
            screenY // + app.screen.height / 4
        );
        props.viewport.setZoom(
            2,
            true
        );
        let count = state.count + (state.speed * delta);
        let cycleCount = state.cycleCount;
        if (count > 1) {
            count = 0;
            cycleCount += 1;
            const repeat = props.diagramFlowEventInteraction.payload?.repeat || 1;
            if (cycleCount >= repeat) {
                props.onMapFlowEventInteractionClick && props.onMapFlowEventInteractionClick({
                    diagramFlowEventInteraction: props.diagramFlowEventInteraction,
                    type: 'cycle_done'
                });

            }
        }
        setState({
            ...state,
            count,
            cycleCount
        });
    })
    if (
        state.loaded &&
        state.mapFlowEventInteractionId !== props.diagramFlowEventInteraction.id
    ) {
        const newState = getRefreshedState();
        setState(newState);
    }



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
    }
    const onClick = (event: any) => {
        if(!props.onMapFlowEventInteractionClick) {
            return ;
        }
        const newEvent = {
            ...event,
            resource: props
        }
        props.onMapFlowEventInteractionClick(newEvent);
    }
    const spriteRef = createRef<PIXI.AnimatedSprite>();
    if(!state.mapFlowEventInteractionId) {
        return <></>;
    }
 /*   const deltaX = state.startPos.x - state.endPos.x;
    const deltaY = state.startPos.y - state.endPos.y;
    const scale = state.count;
    const screenX = state.startPos.x - (scale * deltaX);
    const screenY = state.startPos.y - (scale * deltaY);*/

    if(
        props.globalState.playMode === 'playing' &&
        !props.diagramFlowEventInteraction.payload?.repeat
    ) {

        // console.log('screenXY:', screenX, ' / ', screenY);
       /* props.viewport.moveCenter(
            screenX, //  + app.screen.width / 2,
            screenY // + app.screen.height / 4
        );*/
       /* if (spriteRef.current) {
            props.viewport.follow(spriteRef.current as DisplayObject);
        }*/
        /* props.viewport.setZoom(
             2,
             true
         );*/
        /*props.viewport.scale.x = 2;
        props.viewport.scale.y = 2;*/
    }
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
                    // interactive={true}

                    anchor={{ x: .5, y: 1}}
                    textures={state.frames}
                    isPlaying={true}
                    initialFrame={0}
                    animationSpeed={0.1}
                    x={screenX }// + app.screen.width / 2} // center horizontally
                    y={screenY }//+ app.screen.height / 4} // align the y axis to one fourth of the screen
                    onmouseover={onmouseover}
                    onmouseout={onmouseout}
                    onclick={onClick}
                />

            }
            {
                props.diagramFlowEventInteraction.payload?.text && <Text
                    text={props.diagramFlowEventInteraction.payload?.text}
                    x={screenX} // + app.screen.width / 2}
                    y={screenY - (spriteRef.current?.height || 0 )} // + app.screen.height / 4 }
                    anchor={{ x: 0.5, y: 0 }}
                    style={style}
                    resolution={8}
                />
            }
        </>
    );

}

export default MapFlowEventInteractionComponent;