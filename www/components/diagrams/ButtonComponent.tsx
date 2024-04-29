import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useState} from 'react';

import * as PIXI from 'pixi.js';
import {AnimatedSprite, Container, NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';
import {TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";


interface TileComponentState{

}
interface ButtonComponentProps{
    text: string
    x:number;
    y: number;
    height: number;
    width: number
    onClick: (event: any) => void
}

const ButtonComponent = (props: ButtonComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<TileComponentState>({

    });
    const spriteRef = createRef<PIXI.NineSlicePlane>();
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



    return (
        <>
            <NineSlicePlane
                interactive={true}
                ref={spriteRef}
                anchor={new PIXI.Point(0, 0)}
                pivot={new PIXI.Point(0, 0)}
                leftWidth={2}
                topHeight={2}
                rightWidth={2}
                bottomHeight={2}
                width={props.width}
                height={props.height}
                x={props.x}
                y={props.y }
                image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/button.png"}
                onclick={props.onClick}
                onmouseover={onmouseover}
                onmouseout={onmouseout}
            ></NineSlicePlane>
            <Text
                text={props.text  || "ButtonComp"}
                x={props.x + 2}
                y={props.y - 1}

                pivot={new PIXI.Point(0, 0)}
                style={new TextStyle({
                    fill: 'black',
                    fontFamily: "Pixel",
                    fontSize: 8,
                    padding: 40
                })}
                interactive={true}
                onclick={props.onClick}
                onmouseover={onmouseover}
                onmouseout={onmouseout}
                resolution={8}
            />
        </>
    );

}

export default ButtonComponent;