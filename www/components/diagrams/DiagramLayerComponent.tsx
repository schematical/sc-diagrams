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

import {Block, DiagramLayer, DiagramObject, GlobalState, Resource, screen_to_isometric} from './util';
import {AlphaFilter, Assets, Color, TextStyle} from "pixi.js";
import {OutlineFilter} from "@pixi/filter-outline";
import {ColorReplaceFilter} from "@pixi/filter-color-replace";

interface DiagramLayerComponentState{
   /* loaded: boolean;
    frames?: PIXI.Texture[];
    count: number;
    yoffset: number;*/
}
interface DiagramLayerComponentProps{
    diagramLayer: DiagramLayer;
    /*diagramObject: DiagramObject;
    // onResourceInteraction?: (event: any) => void;
    globalState: GlobalState*/
}

const DiagramLayerComponent = (props: DiagramLayerComponentProps) => {
    const app = useApp();

    const [state, setState] =useState<DiagramLayerComponentState>({
        loaded: false,
        count: 0,
        yoffset: 0
    });
    const spriteRef = createRef<PIXI.AnimatedSprite>();
    /*const refreshData = async () => {
        const sheet = await Assets.load(props.diagramObject.jsonSrc);
        const frames = Object.keys(sheet.data.frames).map(frame =>
            PIXI.Texture.from(frame)
        );
        setState({
            ...state,
            frames,
            loaded: true,
        });

    }*/

   /* useTick(delta => {
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
    })*/

   /* useEffect( () => {
        if(state.loaded) {
            return;
        }

        refreshData();

    })*/


    return (
        <>
            {
                props.diagramLayer.tileGroups.map((tileGroup) => {
                    if(!tileGroup.startPos || !tileGroup.endPos){
                        return <></>
                    }
                    let realStart: Block = { ...tileGroup.startPos };
                    let realEnd: Block = { ...tileGroup.endPos };
                    if (tileGroup.startPos.x > tileGroup.endPos.x) {
                        realStart.x = tileGroup.endPos.x;
                        realEnd.x = tileGroup.startPos.x;
                    }
                    if (tileGroup.startPos.y > tileGroup.endPos.y) {
                        realStart.y = tileGroup.endPos.y;
                        realEnd.y = tileGroup.startPos.y;
                    }
                    // console.log(`start ${tileGroup.startPos.x}/${tileGroup.startPos.y} - end ${tileGroup.endPos.x}/${tileGroup.endPos.y}  --- rStart ${realStart.x}/${realStart.y} - rEnd ${realEnd.x}/${realEnd.y}`);
                    const tileSprites = [];
                    for(let x = realStart.x; x < realEnd.x; x++) {
                        for(let y = realStart.y; y < realEnd.y; y++) {
                            const [screenX, screenY] = screen_to_isometric(x, y);
                            const colorStr = tileGroup.color;
                            const color =  new Color(colorStr);

                            tileSprites.push(<Sprite
                                interactive={true}
                                image={process.env.NEXT_PUBLIC_ASSET_URL + '/images/diagrams/floor-group-purplet.png'}
                                x={screenX} // + app.screen.width / 2} // center horizontally
                                y={screenY} // + app.screen.height / 4} // align the y axis to one fourth of the screen
                                anchor={{ x: .5, y: 1}}
                                filters = {[
                                    new ColorReplaceFilter(
                                [85/255.0, 10/255.0, 81/255.0],
                                    color.toArray() , // [0/255.0, 0/255.0, 0/255.0],
                                0.001
                            ),
                                    new AlphaFilter(.5)
                                ]}
                            />);
                        }
                    }
                    return tileSprites;
                })


            }


        </>
    );

}

export default DiagramLayerComponent;