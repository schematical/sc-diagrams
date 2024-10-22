"use client";
import {PixiComponent, useApp} from "@pixi/react";
import {Viewport} from "pixi-viewport";
import {DisplayObject} from "pixi.js";

import * as PIXI from "pixi.js";
import React, {forwardRef} from "react";
import {IScale} from "pixi-viewport/dist/plugins/ClampZoom";

export interface ViewportProps {
    width: number
    height: number
    children?: React.ReactNode | any;
}

export interface PixiComponentViewportProps extends ViewportProps {
    app: PIXI.Application
    // onCreate: (viewport: Viewport) => void;


}
export const PixiViewportComponent = PixiComponent('Viewport', {
    create: (props: PixiComponentViewportProps) => {
        const viewport = new Viewport({
            events: props.app.renderer.events,
            screenWidth: props.app.view.width, // window.innerWidth, // props.width,
            screenHeight: props.app.view.height, // window.innerHeight, // props.height,
            worldWidth: props.width * 2,
            worldHeight: props.height * 2,
            ticker: props.app.ticker,
        });

        viewport.drag().pinch().wheel().clampZoom({
            minScale:.1,
            maxScale: 8
        })
        // props.onCreate(viewport);
        return viewport as DisplayObject;
    },
});
export const PixiViewportComponentExt = forwardRef<null, ViewportProps>(function Viewport(props: ViewportProps, ref: React.Ref<Viewport>) {
    const app = useApp();

    // @ts-ignore
    return <PixiViewportComponent ref={ref as any} app={app} {...props as PixiComponentViewportProps} />;
});