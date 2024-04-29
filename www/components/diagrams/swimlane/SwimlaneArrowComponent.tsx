import React, {ChangeEvent, createRef, FormEvent, useEffect, useMemo, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AnimatedSprite, Container, NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';
import {Viewport } from 'pixi-viewport'
import { matrix, multiply } from "mathjs";
// import axios from "axios";
import {Block, Notation, screen_to_isometric} from '../util';
import {TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";


interface SwimlaneArrowComponentState{

}
interface SwimlaneArrowComponentProps{
   onClick?: () => void
   startPos: Block;
   endPos: Block;

   dir?: 'left' | 'right'
}


const SwimlaneArrowComponent = (props: SwimlaneArrowComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<SwimlaneArrowComponentState>({

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

    const downHeight = Math.abs(props.startPos.y - props.endPos.y);
    const horzWidth = props.startPos.x - props.endPos.x;
    let imageUri = process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/SwimlaneArrowRight.png";
    if (
        props.dir === 'left' ||
        horzWidth > 0
    ){
        imageUri = process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/SwimlaneArrowLeft.png";
    }
    return (
        <>
            <NineSlicePlane
                interactive={true}
                ref={spriteRef}
                anchor={new PIXI.Point(0, 0)}
                pivot={new PIXI.Point(0, 0)}
                leftWidth={16}
                topHeight={16}
                rightWidth={16}
                bottomHeight={16}
                width={Math.abs(horzWidth)}
                height={downHeight}
                x={props.startPos.x}
                y={props.startPos.y}
                image={imageUri}
                onclick={props.onClick}
                onmouseover={onmouseover}
                onmouseout={onmouseout}
            ></NineSlicePlane>

        </>
    );

}

export default SwimlaneArrowComponent;