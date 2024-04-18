import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import * as PIXI from 'pixi.js';
import {AnimatedSprite, Container, NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';
import { screen_to_isometric } from './util';
export interface ViewportProps {
    width: number
    height: number
    children?: React.ReactNode | any
}
export interface PixiComponentViewportProps extends ViewportProps {
    app: PIXI.Application
}

interface TileComponentState{
    image: string
}
interface TileComponentProps{
    x: number,
    y: number
    onTileInteraction?: (event: any) => void
}
enum TileImages {
    Floor2 = "/images/diagrams/floor-dotted.png",
    FloorSelected = "/images/diagrams/floor-selected.png"
}
const TileComponent = (props: TileComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<TileComponentState>({
        image: process.env.NEXT_PUBLIC_ASSET_URL + TileImages.Floor2
    });
    const onmouseover = (event: any) => {
        setState({
            ...state,
            image: process.env.NEXT_PUBLIC_ASSET_URL + TileImages.FloorSelected
        })
        if(!props.onTileInteraction) {
            return;
        }
        const newEvent = {
            ...event,
            tile: props,
            eventType: 'mouseOver'
        }
        props.onTileInteraction(newEvent);
    }
    const onmouseout = (event: any) => {
        setState({
            ...state,
            image: process.env.NEXT_PUBLIC_ASSET_URL + TileImages.Floor2
        });

    }

    const [screenX, screenY] = screen_to_isometric(props.x, props.y);
    const onClick = (event: any) => {
       if(!props.onTileInteraction) {
           return;
       }
       const newEvent = {
           ...event,
           tile: props,
           eventType: 'click'
       }
        props.onTileInteraction(newEvent);
    }
    return (
            <Sprite
                interactive={true}
                image={state.image}
                x={screenX} // + app.screen.width / 2} // center horizontally
                y={screenY} // + app.screen.height / 4} // align the y axis to one fourth of the screen
                anchor={{ x: .5, y: 1}}
                onmouseover={onmouseover}
                onmouseout={onmouseout}
                onclick={onClick}
            />
    );

}

export default TileComponent;