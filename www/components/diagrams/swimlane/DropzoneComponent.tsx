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
import {Assets, FederatedEventHandler, FederatedPointerEvent, TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";


interface DropzoneComponentState{
    loaded?: boolean;
    frames?: any;
}
export interface DropzoneComponentProps{
   onClick: (event: DropzoneComponentProps) => void;
   pos: Block;
   width?: number;
   height?: number;

   resource: Resource;
   row: number

}

const DropzoneComponent = (props: DropzoneComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<DropzoneComponentState>({

    });
    const spriteRef = createRef<PIXI.NineSlicePlane>();
   /* const refreshData = async () => {
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

    })*/
    const onmouseover = () => {
        if(!spriteRef.current) {
            return;
        }
        spriteRef.current.alpha = .5;
        // spriteRef.current.filters = [new OutlineFilter(2, 0xf86500)];
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
        spriteRef.current.alpha = .1;
        // spriteRef.current.filters = [];
    }
    const onClick = (event: any) => {
        if (!props.onClick) {
            return;
        }
        props.onClick({
            ...props,
            // event
        })
    }
const width = props.width || 200;
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
                width={width}
                height={props.height || 800}
                x={props.pos.x}
                y={props.pos.y}
                image={process.env.PUBLIC_URL + "/images/diagrams/dropArea.png"}
                alpha={.1}
                onclick={onClick}
                onmouseover={onmouseover}
                onmouseout={onmouseout}

            ></NineSlicePlane>
            {/*<Text
                text={props.resource.name}
                x={props.pos.x}
                y={props.pos.y - 20}

                pivot={new PIXI.Point(0, 0)}
                style={new TextStyle({
                    fill: 'white',
                    fontFamily: "Pixel",
                    fontSize: 8,
                    padding: 40
                })}
                interactive={false}

                resolution={8}
            />*/}
        </>
    );

}

export default DropzoneComponent;