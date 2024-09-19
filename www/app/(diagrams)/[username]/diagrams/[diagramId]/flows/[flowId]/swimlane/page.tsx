"use client";
import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {Sprite, Stage} from '@pixi/react';


import {
    Block,
    Diagram,
    DiagramObject,
    FlowEvent,
    FlowEventInteraction,
    getDiagramById,
    getDiagramObjects,
    getMapFlowById,
    GlobalState,
    DiagramFlow,
    Notation,
    Resource,
    FlowEventDecisionOption,
    sortMapFlowEventInteractions, iToast
} from "@/components/diagrams/util";

import * as PIXI from "pixi.js";

import DropzoneComponent, {DropzoneComponentProps} from "@/components/diagrams/swimlane/DropzoneComponent";
import MapFlowEventDetailComponent from "@/components/diagrams/swimlane/MapFlowEventDetailComponent";
import MapFlowEventInteractionDetailComponent
    from "@/components/diagrams/swimlane/MapFlowEventInteractionDetailComponent";
import DiagramBreadcrumbComponent from "@/components/diagrams/DiagramBreadcrumbComponent";
import {PixiViewportComponent, PixiViewportComponentExt} from '@/components/diagrams/PixiViewportComponent';
import {Viewport} from "pixi-viewport";
import SwimlaneLaneComponent from "@/components/diagrams/swimlane/SwimlaneLaneComponent";
import FlowEventComponent from "@/components/diagrams/swimlane/FlowEventComponent";
import SwimlaneArrowComponent from "@/components/diagrams/swimlane/SwimlaneArrowComponent";
import "./SwimlanePage.css"
import { GQLService } from '@/services/GQLService';
import BackgroundComponent from "@/components/diagrams/BackgroundComponent";
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { FlyoutProvider } from '@/app/flyout-context';
import DiagramSidebarComponent from '../../../DiagramSidebarComponent';
import ChannelMenu from "@/components/channel-menu";
import DirectMessages from "@/app/(default)/messages/direct-messages";
import Channels from "@/app/(default)/messages/channels";
interface SwimlanePageState {
    toasts: iToast[];
    dataUri?: string;
    loaded?: boolean;

    selectedResource?: Resource,

    selectedMapFlowEvent?: FlowEvent,
    diagram?: Diagram;
    mapFlow?: DiagramFlow;
    diagramObjects?: DiagramObject[]
    selectedDiagramObjectId?: string;
    menuState: 'none' | 'adding_interaction'
    menuMode: 'none' | 'mainMenu' | 'mapFlowEventDetail' |  'mapFlowEventInteractionDetail';
    pageMode: 'edit' | 'view';

    selectedResourceJSON?: string
    pixiApp?: PIXI.Application<PIXI.ICanvas>;
    selectedDropzone?: DropzoneComponentProps;

    selectedMapFlowEventInteraction?: FlowEventInteraction;
    selectedMapFlowEventDecisionOption?: FlowEventDecisionOption;

    viewport?: Viewport
}

interface NotationState{
    currentNotations: {
        block: Block,
        notation:  Notation
    }[]

}
interface SwimlanePageParams extends Params{
    username: string;
    diagramId: string;
}
const SwimlanePage = () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    /*    PIXI.settings.RESOLUTION = 4;
        PIXI.settings.PRECISION_FRAGMENT = PRECISION.HIGH;
        PIXI.settings.ROUND_PIXELS = true;*/
    const params = useParams<SwimlanePageParams>();
    const [notationState, setNotationState] = useState<NotationState>({
        currentNotations: [],
    });
    const [globalState, setGlobalState] = useState<GlobalState>({
        playMode: "playing",
        diagramMode: "map"
    });
    const [state, setState] = useState<SwimlanePageState>({
        toasts: [],
        pageMode: 'view',
        menuState: 'none',
        menuMode: 'none',

    });
    const refreshData = async () => {
        if (
            !params.username ||
            !params.diagramId ||
            !params.flowId
        ) {
            throw new Error("Missing uri params");
        }
        const diagram: Diagram = await GQLService.getDiagramById({
            parentUri: params.username,
            _id: params.diagramId
        });
        const diagramObjects = (await GQLService.listDiagramObject({parentUri: params.username})).Items;
        const mapFlow: DiagramFlow = (await GQLService.getDiagramFlowById({
            parentUri: `${params.username}/diagrams/${params.diagramId}`,
            _id: params.flowId }
        ));
        mapFlow.data = mapFlow.data || {
            events: [],
            interactions: []
        };
        mapFlow.data.events = mapFlow.data?.events?.sort((a: FlowEvent, b: FlowEvent) => (a.row - b.row)) || [];
        delete((mapFlow as any).__typename);
        setState({
            ...state,
            loaded: true,
            diagram: {
                ...diagram
            },
            diagramObjects,
            mapFlow
        });
    }
    useEffect(() => {
        if (state.loaded) {
            return;
        }
        refreshData();
    });
    async function onSave() {
        if (!state.mapFlow) throw new Error("Missing `state.mapFlow`");
        try {
            const res = await GQLService.createDiagramFlow(state.mapFlow);
            addToast({
                header:"Success",
                body: "Save successful"
            })
        }catch(err: any) {
            addToast({
                header:"Error",
                body: err.message
            });
        }

    }
    function onDropZoneClick(event: DropzoneComponentProps) {
        const resource = state.diagram?.data?.resources.find((r) => r.id === event.resource.id);
        if(!resource) throw new Error("Could not find `resource`");
        if(!state.mapFlow?.data) throw new Error("Missing `state.mapFlow.data`");
        const mapFlowEvent: FlowEvent = {
            id: `res-${Math.floor(Math.random() * 99999)}`,
            row: event.row,
            resourceId: event.resource.id,
        }
        if (!state.mapFlow) throw new Error("Missing `state.diagram`");
        let mapFlowEvents: FlowEvent[] = state.mapFlow.data.events;
        mapFlowEvents.splice(event.row, 0, mapFlowEvent);
        mapFlowEvents = mapFlowEvents.map((mapFlowEvent, index) => {
            mapFlowEvent.row = index;
            return mapFlowEvent;
        })
        setState({
            ...state,
            selectedDropzone: undefined,
            menuMode: 'mapFlowEventDetail',
            selectedMapFlowEvent: mapFlowEvent,
            mapFlow: {
                ... state.mapFlow,
                data: {
                    ... state.mapFlow.data,
                    events: mapFlowEvents
                }
            }
        })

    }

    /*    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const newState = {
                ...state,
                [event.target.name]: event.target.value
            };
            setState(newState);
        }
        */

    async function onDownloadImage(event: any) {
        if (!state.pixiApp) throw new Error("No `pixiApp`");
        if (!state.pixiApp.renderer?.view) throw new Error("No `pixiApp.renderer.view`");
        // @ts-ignore
        const blob = await state.pixiApp.renderer.extract.base64(state.pixiApp.stage);
        const dataUri = blob.replace("image/png", "image/octet-stream");

        setState({
            ...state,
            dataUri
        });
    }
    function updateMapFlowEvent(mapFlowEvent: FlowEvent) {
        if (!state.mapFlow?.data) {
            throw new Error("No `state.mapFlow.data`");
        }
        const mapFlowEvents: FlowEvent[] = state.mapFlow.data.events.map((_mapFlowEvent) => {
            if (
                _mapFlowEvent.id !== mapFlowEvent.id
            ) {
                return _mapFlowEvent;
            }
            return mapFlowEvent;
        })
        const newState: SwimlanePageState = {
            ...state,
            // selectedResource: JSON.parse(state.selectedResourceJSON || "{}"),
            selectedMapFlowEvent: undefined,
            menuMode:'none',
            mapFlow: {
                ...state.mapFlow,
                data: {
                    ...state.mapFlow.data,
                    events: mapFlowEvents
                }
            }
        };
        console.log("newState: ", newState);
        setState(newState);
    }
    function onDeleteMapFlowEvent(mapFlowEvent: FlowEvent){
        if (!state.mapFlow?.data) {
            throw new Error("No `state.mapFlow.data`");
        }
        let mapFlowEvents: FlowEvent[] = state.mapFlow.data.events.filter((m) => m.id !== mapFlowEvent.id);
        mapFlowEvents = mapFlowEvents.map((mapFlowEvent, index) => {
            mapFlowEvent.row = index;
            return mapFlowEvent;
        })
        const interactions: FlowEventInteraction[] = state.mapFlow.data.interactions.filter((i) => i.event1 !== mapFlowEvent.id && i.event2 !== mapFlowEvent.id);
        const newState: SwimlanePageState = {
            ...state,
            // selectedResource: JSON.parse(state.selectedResourceJSON || "{}"),
            menuMode: 'none',
            selectedMapFlowEvent: undefined,
            mapFlow: {
                ...state.mapFlow,
                ...state.mapFlow,
                data: {
                    ...state.mapFlow.data,
                    events: mapFlowEvents,
                    interactions: interactions
                }
            }
        };
        console.log("newState: ", newState);
        setState(newState);
    }
    function onDeleteMapFlowEventInteraction(mapFlowEventInteraction: FlowEventInteraction){
        if (!state.mapFlow?.data) {
            throw new Error("No `state.mapFlow.data`");
        }
        let mapFlowEventInteractions: FlowEventInteraction[] = state.mapFlow.data.interactions.filter((m) => m.id !== mapFlowEventInteraction.id);
        /* mapFlowEventInteractions = mapFlowEventInteractions.map((mapFlowEventInteraction, index) => {
             mapFlowEventInteraction.row = index;
             return mapFlowEventInteraction;
         })*/

        const newState: SwimlanePageState = {
            ...state,
            menuMode: 'none',
            selectedMapFlowEvent: undefined,
            selectedMapFlowEventInteraction: undefined,
            mapFlow: {
                ...state.mapFlow,
                data: {
                    ...state.mapFlow.data,
                    interactions: mapFlowEventInteractions
                }
            }
        };
        setState(newState);
    }
    function onConnectMapFlowEvent(mapFlowEvent: FlowEvent) {
        setState({
            ...state,
            menuMode: 'none',
            menuState: 'adding_interaction',
            selectedMapFlowEvent: mapFlowEvent
        })
    }
    function onFlowEventClick(mapFlowEvent: FlowEvent) {
        if (state.menuState === 'adding_interaction'){
            if (!state.selectedMapFlowEvent) throw new Error("Missing `state.selectedMapFlowEvent`");
            if (!state.mapFlow) throw new Error("Missing `state.mapFlow`");
            if (!state.mapFlow?.data) {
                throw new Error("No `state.mapFlow.data`");
            }
            const mapFlowEventInteraction: FlowEventInteraction = {
                event1: state.selectedMapFlowEvent.id,
                event2: mapFlowEvent.id,
                eventOption1: state.selectedMapFlowEventDecisionOption?.id || undefined,
                id: `fei-${Math.floor(Math.random() * 9999)}`
            };
            let interactions = state.mapFlow.data.interactions || [];
            interactions.push(mapFlowEventInteraction);
            interactions = sortMapFlowEventInteractions({
                ...state.mapFlow,
                data: {
                    ...state.mapFlow.data,
                    interactions
                }
            });
            setState({
                ...state,
                menuState: 'none',
                mapFlow: {
                    ...state.mapFlow,
                    ...state.mapFlow,
                    data: {
                        ...state.mapFlow.data,
                        interactions
                    }
                }
            })
            return;
        }
        setState({
            ...state,
            menuMode: 'mapFlowEventDetail',
            selectedMapFlowEvent: mapFlowEvent
        })
    }

    function onFlowEventInteractionClick(mapFlowEventInteraction: FlowEventInteraction) {
        setState({
            ...state,
            menuMode: 'mapFlowEventInteractionDetail',
            selectedMapFlowEventInteraction: mapFlowEventInteraction
        })

    }

    function onConnectOptionClick(mapFlowEvent: FlowEvent, mapFlowEventDecisionOption: FlowEventDecisionOption) {
        setState({
            ...state,
            menuState: 'adding_interaction',
            menuMode: 'none',
            selectedMapFlowEvent: mapFlowEvent,
            selectedMapFlowEventDecisionOption: mapFlowEventDecisionOption
        })
    }
    function showMenu() {
        return (
            state.menuMode !== 'none'
        );
    }
    function addToast(toast: iToast) {
        const toasts = state.toasts;
        toasts.push(toast);
        setState({
            ...state,
            toasts
        });
    }

    function closeToast(index: number) {
        let toasts = state.toasts;
        toasts = toasts.filter((t, i) => i !== index);
        setState({
            ...state,
            toasts
        });
    }

    function onViewportCreate(viewport: Viewport): void {
        console.log("onViewportCreate");
        /*    setState({
                ...state,
                viewport
            })*/
    }


    const resize = () => {
        state.pixiApp?.renderer.resize(window.innerWidth, window.innerHeight);
    }
    if (typeof window !== "undefined") {
        // Client-side-only code
        window.addEventListener("resize", resize);
    }

    resize();
    /*   useEffect(() => resize(), []);*/






    function getDiagramObject(diagramObjectId: string): DiagramObject {
        const diagramObject = state.diagramObjects?.find((diagramObject) => {
            return diagramObject._id === diagramObjectId;
        });
        if (!diagramObject) {
            throw new Error(`Cannot find diagramObject with objectId '${diagramObjectId}'`);
        }
        return diagramObject;
    }
    function getResourcePosByIsoPos(pos: Block): Block {

        const index = state.diagram?.data?.resources.findIndex((r) => {
            return r.x === pos.x && r.y === pos.y;
        });
        if(index === undefined) throw new Error("Could not find index for block: " + pos.x + ',' + pos.y);
        return {
            x: (index) * LANE_WIDTH,
            y: 0
        }
    }
    function getResourcePosByResourceId(resourceId: string): Block {
        const index = state.diagram?.data?.resources.findIndex((r) => {
            return r.id === resourceId;
        });
        if(index === undefined) throw new Error("Could not find index for resourceId: " + resourceId);
        return {
            x: index,
            y: 0
        }
    }
    function getResourcePosByFlowEventId(eventId: string) {
        const mapFlowEvent: FlowEvent | undefined = state.mapFlow?.data?.events.find((m) => m.id === eventId);
        if(!mapFlowEvent) throw new Error("Could not find mapFlowEvent");
        const pos =  getResourcePosByResourceId(mapFlowEvent.resourceId);
        pos.y = mapFlowEvent.row;
        return pos;
    }
    function getResourcePosOffsetByFlowEventId(eventId: string, eventOption: string) {
        const mapFlowEvent: FlowEvent | undefined = state.mapFlow?.data?.events.find((m) => m.id === eventId);
        if(!mapFlowEvent?.options) throw new Error("Could not find mapFlowEvent.options");
        const eventOptionIndex = mapFlowEvent.options.findIndex((eo) => eo.id === eventOption);
        return eventOptionIndex / mapFlowEvent.options.length + (1 / (mapFlowEvent.options.length + 1));

    }
    document.body.style.overflow = "hidden"

    // moveCenter
    const LANE_WIDTH = 350;
    const boxWidth = 300;
    const boxHeight = 200;
    const boxPadding = 50;
    const LANE_HEIGHT = ((state.mapFlow?.data?.events.length || 0) + 10) * (boxHeight + boxPadding);

    function renderDropZones(): any {
        const dropzones: any[] = [];
        state.diagram?.data?.resources.forEach((resource, index) => {
            dropzones.push(<DropzoneComponent
                pos={{
                    x: index * LANE_WIDTH,
                    y: 0
                }}
                height={boxPadding}
                width={LANE_WIDTH}
                onClick={onDropZoneClick}
                resource={resource}
                row={0}
                // onResourceInteraction={onResourceInteraction}
                // globalState={props.globalState}
            />);
            state.mapFlow?.data?.events.forEach((mapFlowEvent: FlowEvent, index2) => {
                dropzones.push(<DropzoneComponent
                    pos={{
                        x: index * LANE_WIDTH,
                        y: (index2 + 1) * (boxHeight + boxPadding)
                    }}
                    height={boxPadding}
                    width={LANE_WIDTH}
                    onClick={onDropZoneClick}
                    resource={resource}
                    row={index2 + 1}
                    // onResourceInteraction={onResourceInteraction}
                    // globalState={props.globalState}
                />);
            })
        })
        return dropzones;
    }



    return (
        <FlyoutProvider>
            <div className="fixed bottom-0 z-30">
                <div
                    className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
                    <div className="row ">
                        <div className="col-12">
                            <DiagramBreadcrumbComponent params={params}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <a className="btn btn-outline-secondary" type="button"
                                   href={state.dataUri}
                                   target="_blank"
                                   onClick={onDownloadImage}
                                   download="download.png">
                                    Download
                                </a>
                                <button className="btn btn-outline-secondary" type="button"
                                        onClick={onSave}>
                                    Save
                                </button>

                                <a
                                    href={`/${params.username}/diagrams/${params.diagramId}/flows/${params.flowId}`}
                                    className="btn btn-outline-primary"
                                >
                                    <i className="fa fa-map-o" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Stage id="pixi-canvas" style={{display: 'inline'}} onMount={(app) => {
                console.log("pixiCanvas-onMount")
                setState({
                    ...state,
                    pixiApp: app
                })
            }}>
                <Sprite
                    image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/bkgdSky.png"}
                    height={window.innerHeight}
                    width={window.innerWidth}
                    x={0}
                    y={0}

                />
                {
                    state.pixiApp &&
                    state.diagram &&
                    <PixiViewportComponentExt

                        height={LANE_HEIGHT} // state.pixiApp?.screen.height || 100}
                        width={LANE_WIDTH * (state.diagram?.data?.resources.length || -1)} // state.pixiApp?.screen.width || 100}
                    >
                        <BackgroundComponent/>


                        {
                            state.diagram?.data?.resources.map((resource, index) => {


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
                                        globalState={globalState}
                                    />

                                </>
                            })
                        }

                        {
                            renderDropZones()
                        }
                        {
                            state.mapFlow?.data?.events.map((mapFlowEvent, index) => {


                                const startX = getResourcePosByResourceId(mapFlowEvent.resourceId).x * LANE_WIDTH;
                                const startY = (index) * (boxHeight + boxPadding) + boxPadding;


                                return <>
                                    <FlowEventComponent
                                        key={index}
                                        mapFlowEvent={mapFlowEvent}
                                        width={boxWidth}
                                        height={boxHeight}
                                        x={startX}
                                        y={startY}
                                        onClick={onFlowEventClick}
                                    />
                                </>
                            })
                        }

                        {
                            state.mapFlow?.data?.interactions &&
                            state.mapFlow?.data?.interactions.map((mapFlowEventInteraction, index) => {


                                const startPos = getResourcePosByFlowEventId(mapFlowEventInteraction.event1);
                                const startX = startPos.x * LANE_WIDTH;
                                const startY = (startPos.y) * (boxHeight + boxPadding) + boxPadding;

                                const endPos = getResourcePosByFlowEventId(mapFlowEventInteraction.event2);
                                const endX = endPos.x * LANE_WIDTH;
                                const endY = (endPos.y) * (boxHeight + boxPadding) + boxPadding;

                                let startXOffset = boxWidth * .5;
                                if (mapFlowEventInteraction.eventOption1) {
                                    startXOffset = getResourcePosOffsetByFlowEventId(mapFlowEventInteraction.event1, mapFlowEventInteraction.eventOption1) * boxWidth;
                                }


                                let arrowStartPos = {
                                    x: startX + startXOffset,
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
                                                onFlowEventInteractionClick(mapFlowEventInteraction);
                                            }}
                                        />
                                    }

                                </>
                            })
                        }


                    </PixiViewportComponentExt>
                }


            </Stage>
            <FlyoutProvider initialState={false}>
                {
                    // shouldShowMenu() &&
                    <DiagramSidebarComponent>
                        <div className="sticky top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-[18rem] xl:w-[20rem] h-[calc(100dvh-64px)]">
                            <div>
                                <div className="flex h-[100dvh] overflow-hidden">
                                {
                                    state.menuMode === 'mapFlowEventDetail' &&
                                    state.selectedMapFlowEvent &&
                                    <MapFlowEventDetailComponent
                                        mapFlowEvent={state.selectedMapFlowEvent}
                                        onUpdate={updateMapFlowEvent}
                                        onConnect={onConnectMapFlowEvent}
                                        onDelete={onDeleteMapFlowEvent}
                                        onConnectOptionClick={onConnectOptionClick}
                                    />
                                }
                                {
                                    state.menuMode === 'mapFlowEventInteractionDetail' &&
                                    state.selectedMapFlowEventInteraction &&
                                    <MapFlowEventInteractionDetailComponent
                                        mapFlowEventInteraction={state.selectedMapFlowEventInteraction}
                                        onDelete={onDeleteMapFlowEventInteraction}
                                        onSave={onSave}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    </DiagramSidebarComponent>
                }
            </FlyoutProvider>

            {/*{
                <ToastContainer
                    className="p-3"
                    position='top-start'
                    style={{zIndex: 1}}
                >
                    {
                        state.toasts.map((toast, index) => {
                            return <Toast key={index} onClose={() => closeToast(index)}>
                                <Toast.Header>
                                    <strong className="me-auto">{toast.header}</strong>
                                    <small>{toast.header2}</small>
                                </Toast.Header>
                                <Toast.Body>{toast.body}</Toast.Body>
                            </Toast>

                        })
                    }
                </ToastContainer>
            }*/}
        </FlyoutProvider>
    );
}

export default SwimlanePage;