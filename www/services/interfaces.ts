import {
    Diagram,
    DiagramFlow,
    DiagramLayer, DiagramObject,
    FlowEventInteraction,
    Resource,
    Tile,
    TileGroup
} from "@/components/diagrams/util";
import {Viewport} from "pixi-viewport";
import * as PIXI from "pixi.js";

export interface DiagramPageState {
    loaded?: boolean;
    selectedTile?: Tile,
    selectedResource?: Resource,

    selectedMapFlowEventInteraction?: FlowEventInteraction,
    selectedDiagramLayer?: DiagramLayer;
    selectedDiagramLayerTileGroup?: TileGroup;
    diagram?: Diagram;
    mapFlow?: DiagramFlow;
    diagramObjects?: DiagramObject[]
    selectedDiagramObjectId?: string;
    menuState: 'none' | 'layer_boarder_select_start' | 'layer_boarder_select_end';
    menuMode: 'none' | 'mainMenu' | 'tileDetail' | 'resourceDetail' | 'mapFlowEventList' | 'mapFlowEventDetail' | 'diagramLayersList' | 'diagramLayersDetail';
    pageMode: 'edit' | 'view';

    selectedResourceJSON?: string

    viewport?: Viewport;
    pixiApp?: PIXI.Application<PIXI.ICanvas>;
    innerHeight?: number;
    innerWidth?: number;
}