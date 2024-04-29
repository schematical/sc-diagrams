import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AnimatedSprite, Container, NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';
import {Block, Notation, screen_to_isometric, UtilFunctions} from './util';
import {TextStyle} from "pixi.js";
import ButtonComponent from "./ButtonComponent";


interface TileComponentState{

}
interface NotationComponentProps{
    index: number;
    notation: Notation;
    block: Block;
    onNotationInteraction?: (event: any) => void
    utilFunctions: UtilFunctions
}

const NotationComponent = (props: NotationComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<TileComponentState>({

    });
    /*const onmouseover = () => {
        setState({
            ...state,
            image: TileImages.FloorSelected
        })
    }
    const onmouseout = () => {
        setState({
            ...state,
            image: TileImages.Floor2
        })
    }*/

  /*
    const onClick = (event: any) => {
       if(!props.onNotationInteraction) {
           return;
       }
       const newEvent = {
           ...event,
           tile: props
       }
        props.onNotationInteraction(newEvent);
    }*/
    const [screenX, screenY] = screen_to_isometric(props.block.x, props.block.y);
    const x = screenX; // + app.screen.width / 2;
    const y = screenY - (128 || 0 ); //  + app.screen.height / 4
    const HEIGHT = 100;
    const WIDTH = 200;
    return (
        <>
            <NineSlicePlane

                anchor={new PIXI.Point(200, 100)}
                pivot={new PIXI.Point(200, 100)}
                leftWidth={3}
                topHeight={3}
                rightWidth={3}
                bottomHeight={3}
                width={WIDTH}
                height={HEIGHT}
                x={x}
                y={y}
                image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/button.png"}
            ></NineSlicePlane>
            <Text
                text={props.notation.text  || "NotationComp"}
                x={x + 10}
                y={y + 10}

                pivot={new PIXI.Point(200, 100)}
                style={new TextStyle({
                    fill: 'black',
                    fontFamily: "Merchant Copy",
                    fontSize: 12,
                    padding: 10,
                    wordWrap:true,
                    wordWrapWidth: WIDTH - 10,
                })}
                onclick ={(event) => console.log("Event: ", event)}
                resolution={8}
            />
            <ButtonComponent
                text={"x"}
                x={x-25}
                y={y - 95}
                height={10}
                width={10}
                onClick={() => props.utilFunctions.hideNotation(props.index)}
                />
            {

                props.notation.options &&
                props.notation.options.map((option, index) => {
                    if(!props.notation.options) throw new Error("Missing `props.notation.options`");
                    const optionWidth = WIDTH / (props.notation.options.length + 1);
                    return <ButtonComponent
                        text={option.text}
                        x={x - WIDTH + (WIDTH/(props.notation.options.length + 2)) + (index * optionWidth)}
                        y={y - 25}
                        height={20}
                        width={optionWidth}
                        onClick={() => {
                            props.utilFunctions.selectOption(option)
                        }}
                    />
                })
            }
        </>
    );

}

export default NotationComponent;