"use client"
/*export const metadata = {
  title: 'Dashboard - Mosaic',
  description: 'Page description',
}*/
import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {PixiComponent, Sprite, Stage} from '@pixi/react';
import {useParams} from 'next/navigation'

import axios from "axios";
import {
    Block,
    Diagram,
    DiagramObject,
    getDiagramById,
    getDiagramObjects,
    getMapFlowById,
    GlobalState,
    DiagramFlow,
    Notation,
    putDiagram,
    Resource,
    FlowEventInteractionEvent,
    Tile,
    UtilFunctions,
    FlowEventInteraction,
    getResourceFromMapFlowEventId, FlowEventDecisionOption, generateGrid, DiagramLayer, TileGroup
} from "@/components/diagrams/util";
import * as PIXI from "pixi.js";
import ResourceDetailComponent from "@/components/diagrams/map/ResourceDetailComponent";
import DiagramBreadcrumbComponent from "@/components/diagrams/DiagramBreadcrumbComponent";
import {PixiViewportComponent, PixiViewportComponentExt} from '@/components/diagrams/PixiViewportComponent';
import {Viewport} from "pixi-viewport";
import TileComponent from "@/components/diagrams/TileComponent";
import MapFlowEventInteractionComponent from "@/components/diagrams/MapFlowEventInteractionComponent";
import ResourceComponent from "@/components/diagrams/ResourceComponent";
import NotationComponent from "@/components/diagrams/NotationComponent";
import {DisplayObject} from "pixi.js";
import BackgroundComponent from "@/components/diagrams/BackgroundComponent";
import {GQLService} from "@/services/GQLService";
import {DiagramLayersListComponent} from '@/components/diagrams/DiagramLayersListComponent';
import {DiagramLayersDetailComponent} from '@/components/diagrams/DiagramLayersDetailComponent';
import DiagramLayerComponent from "@/components/diagrams/DiagramLayerComponent";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import MessagesSidebar from "@/app/(default)/messages/messages-sidebar";
import {FlyoutProvider} from "@/app/flyout-context";
import DiagramSidebarComponent from "@/app/(diagrams)/[username]/diagrams/[diagramId]/DiagramSidebarComponent";
import Image from "next/image";
import SidebarLink from "@/components/ui/sidebar-link";

import {DiagramPageState} from "@/services/interfaces";
import UserImage01 from "@/public/images/user-32-01.jpg";


export interface DiagramPageParams extends Params {
    username: string;
    diagramId: string;
    flowId: string;
}

interface ViewportState {
    isInitialized: boolean;
    isDragging: boolean;
}

interface NotationState {
    currentNotations: {
        block: Block,
        notation: Notation
    }[]

}

/*
interface DiagramPageProps {
    mode: 'view' | 'edit'
}
*/

const DiagramPage = (/*props: DiagramPageProps*/) => {
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    /*    PIXI.settings.RESOLUTION = 4;
        PIXI.settings.PRECISION_FRAGMENT = PRECISION.HIGH;
        PIXI.settings.ROUND_PIXELS = true;*/

    const params = useParams<DiagramPageParams>();
    const [notationState, setNotationState] = useState<NotationState>({
        currentNotations: [],
    });
    const [globalState, setGlobalState] = useState<GlobalState>({
        playMode: "paused",
        diagramMode: "map"
    });
    const [viewportState, setViewportState] = useState<ViewportState>({
        isInitialized: false,
        isDragging: false
    });
    const [state, setState] = useState<DiagramPageState>({

        pageMode: 'view',
        menuState: 'none',
        menuMode: 'none',

    });
    const resize = () => {

        setState({
            ...state,
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth
        })
        state.pixiApp?.renderer.resize(window.innerWidth, window.innerHeight);
    }
    useEffect(() => {
        window.addEventListener("resize", resize);
        resize();
        document.body.style.overflow = "hidden";
        setState({
            ...state,
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth
        })
    }, []);
    const refreshData = async () => {

        if (
            !params.username ||
            !params.diagramId
        ) {
            throw new Error("Missing uri params");
        }
        const diagram: Diagram = await GQLService.getDiagramById({parentUri: params.username, _id: params.diagramId});
        delete ((diagram as any).__typename);
        const diagramObjects = (await GQLService.listDiagramObject({parentUri: 'schematical' /*params.username*/})).Items;
        const newState = {
            ...state,
            loaded: true,
            diagram: {
                ...diagram
            },
            diagramObjects
        };
        if (params.flowId) {
            newState.mapFlow = (await GQLService.getDiagramFlowById({
                parentUri: `${params.username}/diagrams/${params.diagramId}`,
                _id: params.flowId
            }));
        }

        setState(newState);
    }
    useEffect(() => {
        if (state.loaded) {
            return;
        }
        refreshData();
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newState = {
            ...state,
            [event.target.name]: event.target.value
        };
        setState(newState);
    }

    /* const handleResourceJSONChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
         setState({
             ...state,
             selectedResourceJSON: event.target.value
         });
     }*/
    const initViewport = () => {
        if (!viewportRef.current) {
            console.log("NOPE");
            return;
        }
        viewportRef.current.on('drag-start', (e: any) => {
            setViewportState({
                ...viewportState,
                isDragging: true
            });
        })
        viewportRef.current.on('drag-end', (e: any) => {
            setViewportState({
                ...viewportState,
                isDragging: false
            });
        })
        setViewportState({
            ...viewportState,
            isInitialized: true
        });
    }

    function onTileInteraction(event: any) {
        if (state.pageMode === 'view') {
            return;
        }
        if (!viewportState.isInitialized) {
            initViewport();
        }
        switch (event.eventType) {
            case('click'):
                switch (state.menuState) {
                    case('layer_boarder_select_start'):
                        setState({
                            ...state,
                            menuState: 'layer_boarder_select_end'
                        });
                        break;
                    case('layer_boarder_select_end'):
                        setState({
                            ...state,
                            menuState: 'none',
                            menuMode: 'diagramLayersDetail'
                        });
                        break;
                    default:
                        setState({
                            ...state,
                            menuMode: 'tileDetail',
                            selectedTile: event.tile,
                            selectedResource: undefined
                        });
                }

                break;
            case('mouseOver'):
                if (
                    state.menuState === 'layer_boarder_select_start' ||
                    state.menuState === 'layer_boarder_select_end'
                ) {

                    const tileGroup = state.selectedDiagramLayerTileGroup;

                    if (!tileGroup) throw new Error("Missing `state.selectedDiagramLayerTileGroup`");
                    const pos = {
                        x: event.tile.x,
                        y: event.tile.y,
                    };
                    if (state.menuState === 'layer_boarder_select_start') {
                        tileGroup.startPos = pos;
                    } else {
                        tileGroup.endPos = pos;
                    }
                    updateDiagramLayerTileGroup(tileGroup);
                    /* setState({
                         ...state,
                         selectedDiagramLayerTileGroup: tileGroup

                     });*/
                }

                break;
        }

    }

    function onResourceInteraction(event: any) {
        if (state.pageMode === 'view') {
            setState({
                ...state,
                menuMode: 'resourceDetail',
                selectedResource: event.resource,
            })
            return;
        }
        if (state.menuState === 'none') {
            setState({
                ...state,
                menuMode: 'resourceDetail',
                selectedResource: event.resource,
                selectedTile: undefined,
                selectedResourceJSON: JSON.stringify(event.resource, null, 3)
            });
            return;
        }


    }

    const onSetResourceClick = () => {
        if (!state.selectedTile) {
            return;
        }
        if (!state.selectedDiagramObjectId) {
            throw new Error("Missing `state.selectedDiagramObjectId`")
        }
        const resources = state.diagram?.data?.resources || [];
        const newResource = {
            id: 'res-' + resources.length + '-' + Math.floor(Math.random() * 99999),
            x: state.selectedTile.x,
            y: state.selectedTile.y,
            objectId: state.selectedDiagramObjectId
        };
        resources.push(newResource);
        setState({
            ...state,
            menuMode: 'resourceDetail',
            selectedResource: newResource,
            selectedTile: undefined,
            selectedResourceJSON: JSON.stringify(newResource, null, 3),
            diagram: {
                ...state.diagram,
                data: {
                    ...state.diagram?.data,
                    resources
                }
            } as Diagram
        });
    }
    const onDeleteResourceClick = () => {
        if (!state.selectedResource) {
            throw new Error("No `state.selectedResource`")
        }
        let resources = state.diagram?.data?.resources || [];
        resources = resources.filter((resource) => {
            return !(
                resource.x == state.selectedResource?.x &&
                resource.y == state.selectedResource?.y
            );

        });
        setState({
            ...state,
            diagram: {
                ...state.diagram,
                data: {
                    ...state.diagram?.data,
                    resources
                }

            } as Diagram
        });
    }

    const onSaveDiagramClick = async () => {
        if (!state.diagram) throw new Error("Missing `state.diagram`");
        const res = await GQLService.updateDiagram(state.diagram);
        console.log("onSaveDiagramClick - res", res);
    }


    function updateResource(targetResource: Resource, options?: { useState?: DiagramPageState, returnState: boolean}) {
        const _state = options?.useState || state;
        if (!_state.diagram) {
            throw new Error("No `state.diagram`");
        }
        const resources: Resource[] = _state.diagram.data?.resources.map((resource) => {
            if (
                resource.x !== targetResource?.x ||
                resource.y !== targetResource?.y
            ) {
                return resource;
            }
            return targetResource;
        }) || [];
        const newState: DiagramPageState = {
            ..._state,
            selectedResource: JSON.parse(_state.selectedResourceJSON || "{}"),
            diagram: {
                ..._state.diagram,
                data: {
                    ..._state.diagram.data,
                    resources
                }
            }
        };

        if(options?.returnState){
            return newState;
        }
        setState(newState);
    }


    function onIncrementMapFlowInteraction(increment: number, options?: { returnState: boolean}) {

        if (!state.mapFlow?.data) {
            throw new Error("Missing `state.mapFlow.data`");
        }
        let newIndex = 0;
        if (state.selectedMapFlowEventInteraction) {
            const index = state.mapFlow?.data?.interactions.findIndex((rr) => {
                console.log("rr.id === state.selectedMapFlowEventInteraction?.id", rr.id, " === ", state.selectedMapFlowEventInteraction?.id);
                return rr.id === state.selectedMapFlowEventInteraction?.id;
            });
            newIndex = index + increment;
            console.log(newIndex, " = ", index, " + ", increment);
        }

        if (newIndex < 0) {
            newIndex = state.mapFlow?.data?.interactions.length - 1;
        } else if (newIndex >= state.mapFlow?.data?.interactions.length) {
            newIndex = 0;
        }
    console.log("state.mapFlow?.data?.interactions[newIndex]: ", state.mapFlow?.data?.interactions[newIndex].id)
        const newState = {
            ...state,
            /* mapFlow: {
                 ...state.mapFlow,
                 resourceInteractions: resourceInteractions
             },*/
            selectedMapFlowEventInteraction: state.mapFlow?.data?.interactions[newIndex]
        };
        if (options?.returnState){
            return newState;
        }
        setState(newState);
    }


    function onMapFlowEventInteractionEvent(event: FlowEventInteractionEvent) {
        if (!state.diagram) throw new Error("Missing `state.diagram`");
        if (!state.mapFlow) throw new Error("Missing `state.mapFlow`");
        switch (event.type) {
            case('cycle_done'):
                // Check to see if there is an `endNotation`.

                let newState: any = onIncrementMapFlowInteraction(1, { returnState: true });
                const mapFlowEvent = state.mapFlow?.data?.events.find((e) => e.id === event.diagramFlowEventInteraction.event2);
                const resource2 = getResourceFromMapFlowEventId(state.diagram, state.mapFlow, event.diagramFlowEventInteraction.event2);
                if (!resource2) throw new Error("Missing `resource`");
                if(mapFlowEvent?.updatedDiagramObjectId) {
                    resource2.objectId = mapFlowEvent?.updatedDiagramObjectId;
                    const newState2 = updateResource(resource2, { useState: newState, returnState: true });
                    newState = {
                        ...newState,
                        ...newState2
                    }
                }
                if (mapFlowEvent?.text) {
                    displayNotation(
                        resource2,
                        mapFlowEvent
                    );
                    pause();
                }
                setState(newState);

        }
    }

    function displayNotation(block: Block, notation: Notation) {
        const currentNotations = notationState.currentNotations;
        currentNotations.push({
            block,
            notation
        });
        setNotationState({
            ...state,
            currentNotations
        })
    }

    function hideNotation(index: number) {
        const currentNotations = notationState.currentNotations.filter((notation, i) => i != index);
        setNotationState({
            ...state,
            currentNotations
        })
    }

    function hideAllNotations() {
        setNotationState({
            ...state,
            currentNotations: []
        })
    }

    const pause = () => {
        setGlobalState({
            ...globalState,
            playMode: 'paused'
        })
    }
    const play = () => {
        if (!state.selectedMapFlowEventInteraction) {
            onIncrementMapFlowInteraction(1);
        }
        hideAllNotations();
        setGlobalState({...globalState, playMode: "playing"})
    }
    const selectOption = (option: FlowEventDecisionOption) => {
        if (!state.selectedMapFlowEventInteraction) throw new Error("Missing `state.selectedMapFlowEventInteraction`");
        const mapFlowEventInteraction = state.mapFlow?.data?.interactions.find((i) => {
            if (!state.selectedMapFlowEventInteraction) throw new Error("Missing `state.selectedMapFlowEventInteraction`");
            return i.event1 === state.selectedMapFlowEventInteraction.event1 &&
                i.eventOption1 === option.id;
        });
        setState({
            ...state,
            selectedMapFlowEventInteraction: mapFlowEventInteraction
        });
        play();
    }
    const utilFunctions: UtilFunctions = {
        displayNotation,
        hideNotation,
        hideAllNotations,
        pause,
        selectOption
    }

    function shouldShowMenu() {
        return state.menuMode !== 'none';
    }

    function onCloseMenuClick(event: any) {

        setState({
            ...state,
            menuMode: 'none',
            selectedResource: undefined,
            selectedTile: undefined
        })
    }

    function onTogglePageMode(event: any) {
        console.log("event.target.value", event.target.value);

        setState({
            ...state,
            pageMode: event.target.checked ? 'edit' : 'view'
        });
    }

    function onViewportCreate(viewport: Viewport): void {
        setState({
            ...state,
            viewport
        })
    }


    function getDiagramObject(diagramObjectId: string): DiagramObject {
        const diagramObject = state.diagramObjects?.find((diagramObject) => {
            return diagramObject._id === diagramObjectId;
        });
        if (!diagramObject) {
            throw new Error(`Cannot find diagramObject with objectId '${diagramObjectId}'`);
        }
        return diagramObject;
    }

    const grid = useMemo(() => generateGrid(16, 16, (x, y) => ({x, y})), [])
    const viewportRef = useRef<any>();

    const updateDiagramLayer = (diagramLayer: DiagramLayer, tileGroup?: TileGroup) => {
        let layers = state.diagram?.data?.layers || [];
        let found = false;
        layers = layers.map((layer) => {
            if (layer.id === diagramLayer.id) {
                found = true;
                return diagramLayer;
            }
            return layer;
        });
        if (!found) {
            layers.push(diagramLayer);
        }
        if (!state.diagram?.data?.resources) throw new Error("Missing `state.diagram.data.resources`");
        setState({
            ...state,
            selectedDiagramLayer: diagramLayer,
            selectedDiagramLayerTileGroup: tileGroup,
            diagram: {
                ...state.diagram,
                data: {
                    ...state.diagram?.data,
                    layers
                }
            }
        })

    }

    const updateDiagramLayerTileGroup = (tileGroup: TileGroup) => {
        let tileGroups = state.selectedDiagramLayer?.tileGroups || [];
        let found = false;
        tileGroups = tileGroups.map((t) => {
            if (t.id === tileGroup.id) {
                found = true;
                return tileGroup;
            }
            return t;
        });
        if (!found) {
            tileGroups.push(tileGroup);
        }
        if (!state.selectedDiagramLayer) throw new Error("Missing `state.selectedDiagramLayer`");
        let diagramLayer: DiagramLayer = {
            ...state.selectedDiagramLayer,
            tileGroups
        };
        updateDiagramLayer(diagramLayer, tileGroup);
    }

    function onResouceDetailSave(res: Resource) {
        updateResource(res);
        // onSaveDiagramClick();
    }

    return (
        <>
            <FlyoutProvider initialState={true}>
                {
                    shouldShowMenu() &&
                    <DiagramSidebarComponent>
                        <div className="flex h-[100dvh] overflow-hidden">
                            <div
                                className="fixed z-20 flex top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-[18rem] xl:w-[20rem] h-[calc(100dvh-64px)]">

                                {
                                    state.menuMode === 'mainMenu' &&
                                    <div className="border-t border-slate-200 dark:border-slate-700">
                                        <div className="space-y-8 mt-8 px-5">

                                            <div className="mt-4">
                                                <div
                                                    className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-3">
                                                    Main Menu
                                                </div>
                                                <ul className="mb-6">
                                                    <li className="pb-2">
                                                        <a
                                                            className="flex items-center justify-between w-full p-2 rounded bg-indigo-500/30"
                                                            href={`/${params.username}/diagrams/${params.diagramId}/flows/${params.flowId}/swimlane`}>
                                                            <div className="flex items-center truncate">
                                                                <div className="truncate">
                                                                        <span
                                                                            className="text-sm font-medium text-slate-800 dark:text-slate-100">Swim Lane</span>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className="pb-2">
                                                        <button
                                                            className="flex items-center justify-between w-full p-2 rounded bg-indigo-500/30"
                                                            onClick={() => setState({
                                                                ...state,
                                                                menuMode: 'mapFlowEventList'
                                                            })}>
                                                            <div className="flex items-center truncate">
                                                                <div className="truncate">
                                                                        <span
                                                                            className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                                            Event List
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                    <li className="pb-2">
                                                        <button
                                                            className="flex items-center justify-between w-full p-2 rounded bg-indigo-500/30"
                                                            onClick={() => setState({
                                                                ...state,
                                                                menuMode: 'diagramLayersList'
                                                            })}>
                                                            <div className="flex items-center truncate">
                                                                <div className="truncate">
                                                                        <span
                                                                            className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                                            Layer List
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                    </div>

                                }
                                {
                                    state.menuMode === 'tileDetail' &&
                                    <div className="border-t border-slate-200 dark:border-slate-700">
                                        {/* Components */}
                                        <div className="space-y-8 mt-8 px-5">
                                            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                                                Tile
                                                Detail
                                            </h2>
                                            <div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1"
                                                           htmlFor="selectedTileX">
                                                        X
                                                    </label>
                                                    <input className="form-input w-full" type="text"
                                                           placeholder="Y"
                                                           readOnly={true}
                                                           id="selectedTileX" value={state.selectedTile?.x}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1"
                                                           htmlFor="selectedTileY">
                                                        Y
                                                    </label>
                                                    <input className="form-input w-full" type="text"
                                                           placeholder="Y"
                                                           readOnly={true}
                                                           id="selectedTileY" value={state.selectedTile?.y}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1"
                                                       htmlFor="country">
                                                    Object
                                                </label>
                                                <select className="form-select"
                                                        id="selectedDiagramObjectId"
                                                        name="selectedDiagramObjectId"
                                                        onChange={handleChange}>
                                                    {
                                                        state.diagramObjects && state.diagramObjects.map((diagramObject, index) => {
                                                            return <option key={index} value={diagramObject._id}>
                                                                {diagramObject.title}
                                                            </option>
                                                        })
                                                    }
                                                </select>
                                                <button className="btn" type="button"
                                                        onClick={onSetResourceClick}>Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                }


                                {
                                    state.menuMode === 'resourceDetail' &&
                                    state.selectedResource &&
                                    <ResourceDetailComponent
                                        resource={state.selectedResource}
                                        onDelete={onDeleteResourceClick}
                                        onSave={onResouceDetailSave} //onSaveDiagramClick}updateResource
                                        pageMode={state.pageMode}
                                        diagramObjects={state.diagramObjects || []}/>
                                }
                                {
                                    state.menuMode === 'diagramLayersList' &&
                                    state.diagram &&
                                    <DiagramLayersListComponent
                                        diagramPageState={state}
                                        onSave={updateDiagramLayer}
                                        onDelete={(diagramLayer: DiagramLayer) => {
                                            let layers = state.diagram?.data?.layers || [];
                                            // if (!layers) throw new Error("Missing `layers`");
                                            layers = layers.filter((layer) => layer.id !== diagramLayer.id);
                                            if (!state.diagram?.data?.resources) throw new Error("Missing `state.diagram.data.resources`");
                                            setState({
                                                ...state,
                                                diagram: {
                                                    ...state.diagram,
                                                    data: {
                                                        ...state.diagram?.data,
                                                        layers
                                                    }
                                                }
                                            })
                                        }}
                                        onSelectDiagramLayer={(diagramLayer: DiagramLayer) => {
                                            setState({
                                                ...state,
                                                selectedDiagramLayer: diagramLayer,
                                                menuMode: 'diagramLayersDetail'
                                            });
                                        }}
                                    />
                                }
                                {
                                    state.menuMode === 'diagramLayersDetail' &&
                                    state.selectedDiagramLayer &&
                                    <DiagramLayersDetailComponent
                                        diagramPageState={state}
                                        onSelectDiagramLayerTileGroup={(tileGroup: TileGroup) => {
                                            setState({
                                                ...state,
                                                selectedDiagramLayerTileGroup: tileGroup
                                            });
                                        }}
                                        onSelectBoarders={(tileGroup: TileGroup) => {
                                            setState({
                                                ...state,
                                                selectedDiagramLayerTileGroup: tileGroup,
                                                menuMode: 'none',
                                                menuState: 'layer_boarder_select_start'
                                            })
                                        }}
                                        onSave={updateDiagramLayerTileGroup}
                                        onDelete={(tileGroup: TileGroup) => {
                                            let tileGroups = state.selectedDiagramLayer?.tileGroups || [];
                                            tileGroups = tileGroups.filter((t) => t.id !== tileGroup.id);
                                            if (!state.selectedDiagramLayer) throw new Error("Missing `state.selectedDiagramLayer`");
                                            let diagramLayer = {
                                                ...state.selectedDiagramLayer,
                                                tileGroups
                                            };
                                            updateDiagramLayer(diagramLayer);

                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </ DiagramSidebarComponent>
                }

                {/*<div className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">*/}
                {
                    state.innerHeight &&
                    <>

                        <Stage width={state.innerWidth} height={state.innerHeight}
                               style={{display: 'inline', width: '100%', height: '100%'}} onMount={(app) => {
                            app.resizeTo = window;
                            setState({
                                ...state,
                                pixiApp: app
                            })
                        }}>
                            <Sprite
                                image={process.env.NEXT_PUBLIC_ASSET_URL + "/images/diagrams/bkgdSky.png"}
                                height={state.innerHeight}
                                width={state.innerWidth}
                                x={0}
                                y={0}

                            />
                            {
                                state.diagram &&
                                state.diagramObjects &&
                                state.pixiApp &&
                                <PixiViewportComponentExt
                                    // app={state.pixiApp}
                                    height={state.pixiApp.screen.height} // 1000} //
                                    width={state.pixiApp.screen.width} // 1000} //
                                    ref={viewportRef}
                                >
                                    <BackgroundComponent/>
                                    {
                                        state.diagram?.data?.layers?.map((diagramLayer: DiagramLayer) => {
                                            if (!state.diagram) throw new Error("Missing `state.diagram`");
                                            return <DiagramLayerComponent diagramLayer={diagramLayer}/>;
                                        })
                                    }
                                    {
                                        globalState.diagramMode === "map" &&
                                        grid.map(({x, y}, index) => {
                                            // convert the screen coordinate to isometric coordinate

                                            return (
                                                <TileComponent
                                                    key={index}
                                                    onTileInteraction={onTileInteraction}
                                                    x={x}
                                                    y={y}
                                                />
                                            )
                                        })
                                    }

                                    {
                                        state.mapFlow?.data?.interactions.map((mapFlowEventInteraction, index) => {
                                            if (!state.diagram) throw new Error("Missing `state.diagram`")
                                            if (
                                                state.selectedMapFlowEventInteraction?.id !== mapFlowEventInteraction.id
                                            ) {
                                                return <></>;
                                            }
                                            return <MapFlowEventInteractionComponent
                                                key={index}
                                                diagram={state.diagram}
                                                mapFlow={state.mapFlow as DiagramFlow}
                                                diagramFlowEventInteraction={mapFlowEventInteraction}
                                                diagramObject={getDiagramObject('file-light')}
                                                onMapFlowEventInteractionClick={onMapFlowEventInteractionEvent}
                                                globalState={globalState}
                                                viewport={viewportRef.current as Viewport}
                                            />
                                        })
                                    }
                                    {
                                        state.diagram.data?.resources.map((resource, index) => {


                                            return <ResourceComponent
                                                key={index}
                                                resource={resource}
                                                diagramObject={getDiagramObject(resource.objectId)}
                                                onResourceInteraction={onResourceInteraction}
                                                globalState={globalState}
                                            />
                                        })
                                    }


                                    {
                                        notationState.currentNotations.map((notationData, index) => {
                                            return <NotationComponent index={index} notation={notationData.notation}
                                                                      block={notationData.block}
                                                                      utilFunctions={utilFunctions}/>
                                        })

                                    }
                                </PixiViewportComponentExt>
                            }

                        </Stage>
                    </>
                }
                {/*</div>*/}

                <div className="fixed bottom-0 z-30">
                    <div
                        className="flex items-center justify-between bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 md:px-5 h-16">
                        {/*<button
                    className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 mr-3">
                  <span className="sr-only">Add</span>
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path
                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"></path>
                  </svg>
                </button>
                <form className="grow flex">
                  <div className="grow mr-3"><label htmlFor="message-input" className="sr-only">Type a
                    message</label><input
                      id="message-input"
                      className="form-input w-full bg-slate-100 dark:bg-slate-800 border-transparent dark:border-transparent focus:bg-white dark:focus:bg-slate-800 placeholder-slate-500"
                      placeholder="Aa" type="text"/></div>
                  <button type="submit"
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">Send
                    -&gt;</button>
                </form>*/}

                        <DiagramBreadcrumbComponent params={params}/>


                        {
                            state.pageMode === 'edit' &&
                            <>
                                <button type="button" className="btn btn-outline-primary"
                                        onClick={() => setState({...state, menuMode: 'mainMenu'})}>Menu
                                </button>
                                <button type="button" className="btn btn-outline-primary"
                                        onClick={onSaveDiagramClick}>Save Diagram
                                </button>
                            </>
                        }
                        {
                            state.pageMode === 'view' &&
                            state.mapFlow &&
                            <div className="flex flex-wrap -space-x-px px-4">

                                {
                                    globalState.playMode === "playing" &&
                                    <button type="button" className="btn btn-outline-primary"
                                            onClick={() => pause()}>
                                        <i className=" fa fa-pause" aria-hidden="true"/>
                                    </button>
                                }
                                {
                                    globalState.playMode === "paused" &&
                                    <button
                                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                        onClick={() => play()}>
                                        Play
                                        <i className="fa fa-play" aria-hidden="true"/>
                                    </button>
                                }

                                <a
                                    href={`/${params.username}/diagrams/${params.diagramId}/flows/${params.flowId}/swimlane`}
                                    className="btn btn-outline-primary"
                                >
                                    <i className="fa fa-ship" aria-hidden="true"></i>
                                </a>
                            </div>
                        }
                        <div className="m-3 w-24">
                            {/* Start */}
                            <div className="flex items-center">
                                <div className="form-switch">
                                    <input type="checkbox" id="switch-2" className="sr-only"
                                           checked={state.pageMode === 'edit'}
                                           onChange={onTogglePageMode}/>
                                    <label className="bg-slate-400 dark:bg-slate-700" htmlFor="switch-2">
                                        <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                        <span className="sr-only">Edit</span>
                                    </label>
                                </div>
                                <div
                                    className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">{state.pageMode === 'edit' ? 'Edit' : 'View'}</div>
                            </div>
                            {/* End */}
                        </div>
                    </div>
                </div>
            </FlyoutProvider>


        </>
    );
}

export default DiagramPage;