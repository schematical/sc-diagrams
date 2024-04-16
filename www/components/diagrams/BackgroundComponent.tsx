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


interface StarObject {
    x: number,
    y: number,
    speed: number,
    sizeMultiplier: number;
    alpha: number;
    baseAlpha: number
}
interface BackgroundComponentState{
    loaded?: boolean;
    tickCount: number;
    stars?: StarObject[]
}
interface BackgroundComponentProps{

}

const BackgroundComponent = (props: BackgroundComponentProps) => {
    const app = useApp();

    const [state, setState] = useState<BackgroundComponentState>({
        tickCount: 0
    });
    const spriteRef = createRef<PIXI.AnimatedSprite>();
    const refreshData = async () => {
        /*const sheet = await Assets.load(props.diagramObject.jsonSrc);
        const frames = Object.keys(sheet.data.frames).map(frame =>
            PIXI.Texture.from(frame)
        );*/
        const stars = [];
        for(let i = 0; i < 500; i++){
            const alpha = Math.random() * .5;
            const star = {
                x: Math.floor(Math.random() * window.innerWidth * 2) - window.innerWidth,
                y: Math.floor(Math.random() * window.innerHeight * 2) - window.innerHeight,
                speed: Math.floor(Math.random() * 5),
                sizeMultiplier: Math.floor(Math.random() * 5), // Math.pow(2, Math.floor(Math.random() * 5))
                baseAlpha: alpha,
                alpha: alpha

            };
            stars.push(star)
        }
        setState({
            ...state,
            stars,
            // frames,
            loaded: true,
        });

    }

    useTick(delta => {
        if (!state.stars) {
            return;
        }
        if (state.tickCount < 20) {
            setState({
                ...state,
                tickCount: state.tickCount += 1
            })
            return;
        }
        const stars = state.stars.map((star) => {
            let newX = star.x + star.speed;
            if (newX > window.innerWidth * 2) {
                newX = window.innerWidth * -1;
            }
            if (star.alpha > star.baseAlpha) {
                star.alpha -= .1;
            } else if (Math.random() * 999 <= 1) {
                star.alpha = 1;
            }
            return {
                ...star,
                x: newX
            }
        });
        setState({
            ...state,
            stars,
            tickCount: 0
        })
    })

    useEffect( () => {
        if(state.loaded) {
            return;
        }

        refreshData();

    })




    return (
        <>
            {
                state.stars &&
                state.stars.map((star, index) => {

                   return <Sprite
                        key={index}
                        image={process.env.PUBLIC_URL + "/images/diagrams/starSpriteBase.png"}
                        height={16 * (star.sizeMultiplier || 1)}
                        width={16 * (star.sizeMultiplier || 1)}
                        x={star.x} // + app.screen.width / 2} // center horizontally
                        y={star.y} //  + app.screen.height / 4} // align the y axis to one fourth of the screen
                        alpha={star.alpha}

                   />
                })

               /* <AnimatedSprite
                    ref={spriteRef}
                    interactive={true}
                    scale={{
                        x: props.resource?.scale?.x || 1,
                        y: props.resource?.scale?.y || 1
                    }}
                    anchor={{
                        x: props.resource.anchor?.x || .5,
                        y: props.resource.anchor?.y ||1.25
                    }}
                    height={state.frames[0].height * (props.resource.sizeMultiplier || 1)}
                    width={state.frames[0].width * (props.resource.sizeMultiplier || 1)}
                    textures={state.frames}
                    isPlaying={true}
                    initialFrame={Math.floor(Math.random() * state.frames.length)}
                    animationSpeed={0.2}
                    x={screenX} // + app.screen.width / 2} // center horizontally
                    y={screenY + (state.yoffset  * 32)} //  + app.screen.height / 4} // align the y axis to one fourth of the screen

                />*/
            }


        </>
    );

}

export default BackgroundComponent;