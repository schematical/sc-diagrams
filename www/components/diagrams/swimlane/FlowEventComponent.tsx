import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AnimatedSprite, Container, NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';


import {TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";
import {FlowEvent} from "../util";


interface TileComponentState{

}
interface FlowEventComponentProps{
    x:number;
    y: number;
    height: number;
    width: number
    mapFlowEvent: FlowEvent;
    onClick: (event: any) => void;
}

const FlowEventComponent = (props:FlowEventComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<TileComponentState>({

    });

    const onClick = () => {
        props.onClick(props.mapFlowEvent);
    }
    const renderDecision = () => {
        const spriteRef = createRef<PIXI.Sprite>();
        const onmouseover = () => {
            if(!spriteRef.current) {
                return;
            }
            spriteRef.current.filters = [new OutlineFilter(2, 0x99ff99)];
        }
        const onmouseout = () => {
            if(!spriteRef.current) {
                return;
            }
            spriteRef.current.filters = [];
        }
        return (
            <>
                <Sprite
                    ref={spriteRef}
                    anchor={new PIXI.Point(0, 0)}
                    pivot={new PIXI.Point(0, 0)}
                    width={props.width * .75}
                    height={props.height * .75}
                    x={props.x + props.width * .25}
                    y={props.y}
                    image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/decisionDiamond.png"}
                    interactive={true}
                    onmouseover={onmouseover}
                    onmouseout={onmouseout}
                    onclick={onClick}
                ></Sprite>
                {
                    props.mapFlowEvent.options &&
                    props.mapFlowEvent.options.map((option, index) => {
                        if (!props.mapFlowEvent.options) throw new Error("Missing `props.mapFlowEvent.options`");
                        const width = props.width / props.mapFlowEvent.options.length;
                        const x = props.x + width * index;
                        return <>
                            <Sprite
                                key={index}
                                image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/decisionChoice.png"}
                                width={width}
                                height={props.height}
                                x={x}
                                y={props.y + props.height / 4}
                            />
                            <Text
                                key={index}
                                text={option.text || ""}
                                x={x + 40}
                                y={props.y + props.height/2 + 40}


                                pivot={new PIXI.Point(0, 0)}
                                style={new TextStyle({
                                    align: 'center',
                                    fill: 'black',
                                    fontFamily: "Pixel",
                                    fontSize: 16,
                                    padding: 40,
                                    wordWrapWidth: width - 20,
                                    wordWrap: true
                                })}
                                interactive
                                onmouseover={onmouseover}
                                onmouseout={onmouseout}
                                onclick={onClick}
                                resolution={8}
                            />
                        </>
                    })
                }
            </>
        );
    }
    switch(props.mapFlowEvent.type){
        case('decision'):
           return renderDecision();
        break;
        default:

            const spriteRef = createRef<PIXI.NineSlicePlane>();
            const onmouseover = () => {
                if(!spriteRef.current) {
                    return;
                }
                spriteRef.current.filters = [new OutlineFilter(2, 0x99ff99)];
            }
            const onmouseout = () => {

                if(!spriteRef.current) {
                    return;
                }
                spriteRef.current.filters = [];
            }
            return (
                <>

                    <NineSlicePlane
                        ref={spriteRef}
                        anchor={new PIXI.Point(0, 0)}
                        pivot={new PIXI.Point(0, 0)}
                        leftWidth={3}
                        topHeight={3}
                        rightWidth={3}
                        bottomHeight={3}
                        width={props.width}
                        height={props.height}
                        x={props.x}
                        y={props.y}
                        image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/button.png"}
                        interactive={true}
                        onmouseover={onmouseover}
                        onmouseout={onmouseout}
                        onclick={onClick}
                    ></NineSlicePlane>
                    <Text
                        text={props.mapFlowEvent.text || ""}
                        x={props.x + 10}
                        y={props.y + 10}


                        pivot={new PIXI.Point(0, 0)}
                        style={new TextStyle({
                            fill: 'black',
                            fontFamily: "Pixel",
                            fontSize: 16,
                            padding: 40,
                            wordWrapWidth: props.width - 20,
                            wordWrap: true
                        })}
                        interactive
                        onmouseover={onmouseover}
                        onmouseout={onmouseout}
                        onclick={onClick}
                        resolution={8}
                    />
                </>
            );
    }


}

export default FlowEventComponent;