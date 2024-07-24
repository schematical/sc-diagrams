"use client"
/*export const metadata = {
  title: 'Dashboard - Mosaic',
  description: 'Page description',
}*/
import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {PixiComponent, Sprite, Stage} from '@pixi/react';
import { useParams } from 'next/navigation'

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
} from "../../../components/diagrams/util";
import * as PIXI from "pixi.js";
import ResourceDetailComponent from "../../../components/diagrams/map/ResourceDetailComponent";
import DiagramBreadcrumbComponent from "../../../components/diagrams/DiagramBreadcrumbComponent";
import {PixiViewportComponent, PixiViewportComponentExt} from '../../../components/diagrams/PixiViewportComponent';
import {Viewport} from "pixi-viewport";
import TileComponent from "../../../components/diagrams/TileComponent";
import MapFlowEventInteractionComponent from "../../../components/diagrams/MapFlowEventInteractionComponent";
import ResourceComponent from "../../../components/diagrams/ResourceComponent";
import NotationComponent from "../../../components/diagrams/NotationComponent";
import {DisplayObject} from "pixi.js";
import BackgroundComponent from "../../../components/diagrams/BackgroundComponent";
import {GQLService} from "../../../services/GQLService";
import {DiagramLayersListComponent} from '../../../components/diagrams/DiagramLayersListComponent';
import { DiagramLayersDetailComponent } from '../../../components/diagrams/DiagramLayersDetailComponent';
import DiagramLayerComponent from "../../../components/diagrams/DiagramLayerComponent";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {DiagramPageState} from "@/services/interfaces";

interface DiagramPageParams extends Params{
  username: string;
  diagramId: string;
  flowId: string;
}
interface ViewportState{
  isInitialized: boolean;
  isDragging: boolean;
}
interface NotationState {
  currentNotations: {
    block: Block,
    notation: Notation
  }[]

}

interface DiagramPageProps {
  mode: 'view' | 'edit'
}

const DiagramPage = (/*props: DiagramPageProps*/) => {
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  /*    PIXI.settings.RESOLUTION = 4;
      PIXI.settings.PRECISION_FRAGMENT = PRECISION.HIGH;
      PIXI.settings.ROUND_PIXELS = true;*/


  const params = {username: 'schematical', diagramId: 'redis', flowId: undefined}// useParams<DiagramPageParams>();
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
    state.pixiApp?.renderer.resize(window.innerWidth, window.innerHeight);
  }
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    document.body.style.overflow = "hidden";
    setState({
      ...state,
    })
  }, []);
  const refreshData = async () => {
    if (
        !params.username ||
        !params.diagramId
    ) {
      throw new Error("Missing uri params");
    }
    const diagram: Diagram = await GQLService.getDiagramById({ parentUri: params.username, _id: params.diagramId });
    delete((diagram as any).__typename);
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
    if(!viewportState.isInitialized) {
      initViewport();
    }
    switch (event.eventType) {
      case('click'):
        switch (state.menuState) {
          case('layer_boarder_select_start'):
            setState({
              ...state,
              menuState:  'layer_boarder_select_end'
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
        if(
            state.menuState === 'layer_boarder_select_start' ||
            state.menuState === 'layer_boarder_select_end'
        ){

          const tileGroup = state.selectedDiagramLayerTileGroup;

          if(!tileGroup) throw new Error("Missing `state.selectedDiagramLayerTileGroup`");
          const pos  = {
            x: event.tile.x,
            y: event.tile.y,
          };
          if(state.menuState === 'layer_boarder_select_start') {
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
      id: 'res-' + resources.length,
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


  function updateResource(targetResource: Resource) {
    if (!state.diagram) {
      throw new Error("No `state.diagram`");
    }
    const resources: Resource[] = state.diagram.data?.resources.map((resource) => {
      if (
          resource.x !== targetResource?.x ||
          resource.y !== targetResource?.y
      ) {
        return resource;
      }
      return targetResource;
    }) || [];
    const newState: DiagramPageState = {
      ...state,
      selectedResource: JSON.parse(state.selectedResourceJSON || "{}"),
      diagram: {
        ...state.diagram,
        data: {
          ...state.diagram.data,
          resources
        }
      }
    };

    console.log(newState);
    setState(newState);
  }


  function onIncrementMapFlowInteraction(increment: number) {

    if (!state.mapFlow?.data) {
      throw new Error("Missing `state.mapFlow.data`");
    }
    let newIndex = 0;
    if (state.selectedMapFlowEventInteraction) {
      const index = state.mapFlow?.data?.interactions.findIndex((rr) => {
        return rr.id === state.selectedMapFlowEventInteraction?.id;
      });
      newIndex = index + increment;
    }

    if (newIndex < 0) {
      newIndex = state.mapFlow?.data?.interactions.length - 1;
    } else if (newIndex >= state.mapFlow?.data?.interactions.length) {
      newIndex = 0;
    }

    setState({
      ...state,
      /* mapFlow: {
           ...state.mapFlow,
           resourceInteractions: resourceInteractions
       },*/
      selectedMapFlowEventInteraction: state.mapFlow?.data?.interactions[newIndex]
    })
  }


  function onMapFlowEventInteractionEvent(event: FlowEventInteractionEvent) {
    if (!state.diagram) throw new Error("Missing `state.diagram`");
    if (!state.mapFlow) throw new Error("Missing `state.mapFlow`");
    switch (event.type) {
      case('cycle_done'):
        // Check to see if there is an `endNotation`.

        onIncrementMapFlowInteraction(1);
        const mapFlowEvent = state.mapFlow?.data?.events.find((e) => e.id === event.diagramFlowEventInteraction.event2);
        const resource2 = getResourceFromMapFlowEventId(state.diagram, state.mapFlow, event.diagramFlowEventInteraction.event2);
        if (!resource2) throw new Error("Missing `resource`");
        if (mapFlowEvent?.text) {
          displayNotation(
              resource2,
              mapFlowEvent
          );
          pause();

        }


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
    if(!state.selectedDiagramLayer) throw new Error("Missing `state.selectedDiagramLayer`");
    let diagramLayer: DiagramLayer = {
      ...state.selectedDiagramLayer,
      tileGroups
    };
    updateDiagramLayer(diagramLayer, tileGroup);
  }
  return (
      <div>
        {/*<TopbarComponent/>
        <Navbar expand="lg" className="bg-body-tertiary" fixed="bottom">
          <Container>
            <div className="row ">
              <div className="col-12">
                <DiagramBreadcrumbComponent params={params}/>
              </div>
            </div>
            <div className="row">
              <div className="col-4">

                <Form>

                  <Form.Check // prettier-ignore
                      type="switch"
                      id="custom-switch"
                      label="Edit"
                      name="pageMode"
                      value="edit"
                      onChange={onTogglePageMode}
                  />
                </Form>
              </div>
              <div className="col-8">
                {

                  <ButtonGroup aria-label="Basic example">
                     <a href={`/${params.username}/diagrams/${params.diagramId}/flows`}
                                       className="btn btn-outline-primary"
                                    >
                                        Flows
                                    </a>
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
                        <>
                          {
                              globalState.playMode === "playing" &&
                              <button type="button" className="btn btn-outline-primary"
                                      onClick={() => pause()}>
                                <i className=" fa fa-pause" aria-hidden="true"/>
                              </button>
                          }
                          {
                              globalState.playMode === "paused" &&
                              <button type="button" className="btn btn-outline-primary"
                                      onClick={() => play()}>
                                <i className=" fa fa-play" aria-hidden="true"/>
                              </button>
                          }

                          <a
                              href={`/${params.username}/diagrams/${params.diagramId}/flows/${params.flowId}/swimlane`}
                              className="btn btn-outline-primary"
                          >
                            <i className="fa fa-ship" aria-hidden="true"></i>
                          </a>
                        </>
                    }
                  </ButtonGroup>
                }


              </div>
            </div>
          </Container>
        </Navbar>*/}
        {/* <HeaderComponent />*/}
        {/* <div className="container-fluid">
                <div className="row align-items-center text-center header-background">
                    <div className="col">
                        <h1><span>About Us</span></h1>
                    </div>
                </div>
            </div>*/}
        {/*{
          state.window &&
            <>
            <Stage style={{display: 'inline'}} onMount={(app) => {
            setState({
              ...state,
              pixiApp: app
            })
          }}>
            <Sprite
                image={process.env.PUBLIC_URL + "/images/diagrams/bkgdSky.png"}
                height={state.window.innerHeight}
                width={state.window.innerWidth}
                x={0}
                y={0}

            />
            {
                state.diagram &&
                state.diagramObjects &&
                state.pixiApp &&
                <PixiViewportComponentExt
                    // app={state.pixiApp}
                    height={1000} // state.pixiApp.screen.height}
                    width={1000} //state.pixiApp.screen.width}
                    ref={viewportRef}
                >
                  <BackgroundComponent/>
                  {
                    state.diagram?.data?.layers?.map((diagramLayer: DiagramLayer) => {
                      if (!state.diagram) throw new Error("Missing `state.diagram`");
                      return <DiagramLayerComponent diagramLayer={diagramLayer} />;
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
                          diagramObject={getDiagramObject('file-basic')}
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
                                                block={notationData.block} utilFunctions={utilFunctions}/>
                    })

                  }
                </PixiViewportComponentExt>
            }

          </Stage>
            </>
        }*/}
        {/*<FooterComponent/>*/}
      </div>
  );
}

export default DiagramPage;