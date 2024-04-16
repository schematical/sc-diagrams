import React, {ChangeEvent, createRef, FormEvent, forwardRef, useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as PIXI from 'pixi.js';
import { NineSlicePlane, PixiComponent, Sprite, Stage, Text, useApp} from '@pixi/react';
import {Viewport} from 'pixi-viewport'
import {Application, Assets, DisplayObject, TextStyle} from 'pixi.js';
import {
    generateGrid,
    screen_to_isometric,
    Resource,
    Diagram,
    DiagramObject,
    Notation,
    Block,
    UtilFunctions, GlobalState, DiagramFlow, FlowEvent, FlowEventInteraction
} from '../diagrams/util';

import SwimlaneArrowComponent from "../diagrams/swimlane/SwimlaneArrowComponent";
import SwimlaneLaneComponent from "./swimlane/SwimlaneLaneComponent";
import DropzoneComponent, {DropzoneComponentProps} from "./swimlane/DropzoneComponent";
import FlowEventComponent from "./swimlane/FlowEventComponent";
import { PixiViewportComponent } from '../../pages/diagrams/PixiViewportComponent';

interface SwimlaneFlowComponentProps {
    onFlowEventInteractionClick: (mapFlowEventInteraction: FlowEventInteraction) => void;
    onFlowEventClick: (mapFlowEvent: FlowEvent) => void;
    onDropZoneClick: (event: DropzoneComponentProps) => void;
    onTileInteraction?: (event: any) => void
    onResourceInteraction?: (event: any) => void

    onResourceInteractionEvent?: (event: any) => void
    diagram: Diagram;
    mapFlow: DiagramFlow;
    diagramObjects: DiagramObject[];
    currentNotations: {
        block: Block,
        notation: Notation
    }[];
    // utilFunctions: UtilFunctions
    globalState: GlobalState
}

const SwimlaneFlowComponent = (props: SwimlaneFlowComponentProps) => {
    const app = useApp();

/*    // moveCenter
    const LANE_WIDTH = 350;
    const boxWidth = 300;
    const boxHeight = 200;
    const boxPadding = 50;
    const LANE_HEIGHT = ((state.mapFlow?.events.length || 0) + 1) * (boxHeight + boxPadding);*/
    return (
        <h1>COmmented out</h1>
      /*  <PixiViewportComponent
            app={app}
            height={app.screen.height}
            width={app.screen.width}
            onCreate={onViewportCreate}
        >



            {
                props.diagram.resources.map((resource, index) => {


                    return <>
                        <SwimlaneLaneComponent
                            key={index}
                            pos={{
                                x: index * LANE_WIDTH,
                                y: 0
                            }}
                            height={LANE_HEIGHT}
                            width={LANE_WIDTH}
                            resource={resource}
                            diagramObject={getDiagramObject(resource.objectId)}
                            globalState={props.globalState}
                        />

                    </>
                })
            }

            {
                renderDropZones()
            }
            {
                props.mapFlow.events.map((mapFlowEvent, index) => {


                    const startX = getResourcePosByResourceId(mapFlowEvent.resourceId).x * LANE_WIDTH;
                    const startY = (index) * (boxHeight + boxPadding)  + boxPadding;


                    return <>
                        <FlowEventComponent
                            key={index}
                            mapFlowEvent={mapFlowEvent}
                            width={boxWidth}
                            height={boxHeight}
                            x={startX}
                            y={startY}
                            onClick={props.onFlowEventClick}
                        />
                    </>
                })
            }

            {
                props.mapFlow.interactions &&
                props.mapFlow.interactions.map((mapFlowEventInteraction, index) => {


                    const startPos = getResourcePosByFlowEventId(mapFlowEventInteraction.event1);
                    const startX = startPos.x  * LANE_WIDTH;
                    const startY = (startPos.y) * (boxHeight + boxPadding)  + boxPadding;

                    const endPos = getResourcePosByFlowEventId(mapFlowEventInteraction.event2);
                    const endX = endPos.x  * LANE_WIDTH;
                    const endY = (endPos.y) * (boxHeight + boxPadding) + boxPadding;

                    let startXOffset = boxWidth * .5;
                    if (mapFlowEventInteraction.eventOption1) {
                        startXOffset = getResourcePosOffsetByFlowEventId(mapFlowEventInteraction.event1, mapFlowEventInteraction.eventOption1) * boxWidth;
                    }


                    let arrowStartPos = {
                        x: startX + startXOffset ,
                        y: startY + (boxHeight)
                    }
                    let arrowEndPos = {
                        x: endX,
                        y: endY + boxHeight * .5
                    };
                    let dir: 'left' | 'right' = 'right';
                    if (startX >= endX) {
                        dir = 'left';
                        arrowStartPos = {
                            x: endX + boxWidth,
                            y: startY + (boxHeight)
                        };
                        arrowEndPos = {
                            x: startX + startXOffset,
                            y: endY + boxHeight * .5
                        };
                    }
                    return <>

                        {
                            // isThisAContinue &&
                            <SwimlaneArrowComponent
                                key={index}
                                startPos={arrowStartPos}
                                endPos={arrowEndPos}
                                dir={dir}
                                onClick={() => {
                                    props.onFlowEventInteractionClick(mapFlowEventInteraction);
                                }}
                            />
                        }

                    </>
                })
            }



        </PixiViewportComponent>*/
    );

}

export default SwimlaneFlowComponent;