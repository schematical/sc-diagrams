import axios from "axios";
import {matrix, multiply} from "mathjs";
import { getJwt } from "../../services/util";
import * as PIXI from 'pixi.js';
export function screen_to_isometric(x: number, y: number) {

    const isometricWeights = matrix([
        [0.5, 0.25],
        [-0.5, 0.25]
    ]);

    // coordinatex times the size of the block 18 * 4 = 72
    // as it's scaled 4x
    const coordinate = matrix([
        [x * 66, y * 66]
    ]);

    const [isometricCoordinate] = multiply(coordinate, isometricWeights).toArray();
    return isometricCoordinate as number[];
}

export type Block = {
    x: number
    y: number

}
export interface Resource extends Block {

    scale?: Block;
    id: string;
    _selected?: boolean;
    float?: boolean;
    objectId: string
    anchor?: Block

    name?: string;
    notes?: string;
    sizeMultiplier?:  number
}
export interface DiagramLayer {
    id: string;
    name: string,
    tileGroups: TileGroup[];
}
export interface TileGroup {
    color?: string;
    id: string;
    name: string;
    startPos?: Block;
    endPos?: Block;
}
export interface Tile extends Block {
    type?: string
}
/*export interface ResourceInteraction {
    speed?: number;
    id: string;
    resource1: Block;
    resource2: Block;

    order: number;
    _selected?: boolean;
    startNotation? :{
        resource1?: Notation,
        resource2?: Notation
    };
    endNotation? :{
        resource1?: Notation,
        resource2?: Notation
    }
    decision?: {
        options: DecisionOption[]
    }
}
export interface DecisionOption {
    text: string;
    action?: {
        resourceInteractionId: string
    }
}*/
export interface Diagram {
    parentUri?: string;
    description?: any;
    name?: any;
    username: string;
    _id?: string;

    data?: {
        resources: Resource[],
        tiles?: Tile[],
        layers?: DiagramLayer[],
    }
    // resourceInteractions: ResourceInteraction[];
}
export interface DiagramObject/* extends Block*/ {
    _id: string;
    parentUri: string;
    title: string;
    imageSrc?: string;
    jsonSrc?: string;
    description?: string;
    yoffset?: number;
    data?: {
        yoffset?: number
    };
}
export interface Notation {
    text?: string;

    options?: FlowEventDecisionOption[];

}
export interface UtilFunctions{
    displayNotation: (block: Block, notation: Notation) => void
    hideNotation: (index: number) => void,
    hideAllNotations: () => void,

    selectOption: (option: FlowEventDecisionOption) => void,
    pause: () => void
}
export interface GlobalState {
    playMode: 'paused' | 'playing' | 'off'
    diagramMode: 'map' | 'flow'
}
export interface FlowEventInteractionEvent {
    diagramFlowEventInteraction: FlowEventInteraction,
    type: 'cycle_done' | 'cycle_tick'
}
export function generateGrid<T extends Block = Block>(
    rows: number,
    cols: number,
    blockProvider: (x: number, y: number) => T) {
    const grid: T[] = [];
    for (let i = -1 * rows; i < rows; i++) {
        for (let j = -1 * cols; j < cols; j++) {
            grid.push(blockProvider(i, j));
        }
    }
    return grid;
}
export async function getDiagrams(username: string) {
    const headers = await getHeaders();
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${username}/diagrams`,
        {
            headers
        }

    );
    return res.data;
}
export async function getHeaders() {
    let headers: any = {};
    const token = await getJwt();
    if (token) {
        headers.Authorization = token;
    }
    return headers;
}
export async function putDiagram(diagram: Diagram) {
    const headers = await getHeaders();
    const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/' +  diagram.username + '/diagrams/' + diagram._id,
        diagram,
        {
            headers
        }
    );
    return res;
}
export async function getDiagramById(username: string, diagramId: string) {
    const headers = await getHeaders();
    const res = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/' +  username + '/diagrams/' + diagramId,
        {
            headers
        }
    );
    return res;
}
export async function getNetworkMapFlows(username: string,  diagramId: string) {
    const headers = await getHeaders();
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${username}/diagrams/${diagramId}/flows`,
        {
            headers
        }

    );
    return res.data;
}
export async function getMapFlowById(username: string, diagramId: string, flowId: string) {
    const headers = await getHeaders();
    const res = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/' +  username + '/diagrams/' + diagramId + '/flows/' + flowId,
        {
            headers
        }
    );
    return res;
}
export async function putMapFlow(diagramFlow: DiagramFlow) {
    const token = await getJwt();
    const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/' +  diagramFlow.username + '/diagrams/' + diagramFlow.parentUri + '/flows/' + diagramFlow._id,
        diagramFlow,
        {
            headers: {
                Authorization: token
            }
        }
    );
    return res;
}
export async function getDiagramObjects(username: string) {
    const headers = await getHeaders();
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${username}/diagramobjects`,
        {
            headers
        }

    );
    return res.data;
}
export async function putDiagramObject(diagramObject: DiagramObject) {
    const headers = await getHeaders();
    const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/' +  diagramObject.parentUri + '/diagramobjects/' + diagramObject._id,
        diagramObject,
        {
            headers
        }
    );
    return res;
}
export function getResourceFromMapFlowEventId(diagram: Diagram, diagramFlow: DiagramFlow, eventId: string) {
    const diagramFlowEvent = diagramFlow.data?.events.find((e) => e.id == eventId);
    if (!diagramFlowEvent) return null;
    const resource = diagram.data?.resources.find((r) => r.id == diagramFlowEvent.resourceId);
    return resource;
}


export interface FlowEvent{
    id: string;
    resourceId: string;
    objectId?: string;
    updatedDiagramObjectId?: string;

    row: number;

    text?: string;
    type?: 'decision';
    options?: FlowEventDecisionOption[];
}
export interface FlowEventDecisionOption {
    id: string;
    text: string;
}




export interface FlowEventInteraction {
    id: string;
    event1: string;
    eventOption1?: string;
    event2: string;
    payload?: {
        text?: string,
        notes?: string,
        objectId?: string
        speed?: number,
        repeat?: number
    }
}




export interface DiagramFlow {
    _id: string;
    diagramId: any;
    parentUri: string;
    username: string;
    name?: string;
    description?: string;
    data?: {
        events: FlowEvent[];
        interactions: FlowEventInteraction[];
    }
}

export function sortMapFlowEventInteractions(diagramFlow: DiagramFlow) {
    if (!diagramFlow?.data) {
        throw new Error("No `diagramFlow.data`");
    }
    return diagramFlow.data.interactions.sort((a, b) => {
        const diagramFlowEventA = diagramFlow.data?.events.find((m) => m.id === a.event2);
        const diagramFlowEventB = diagramFlow.data?.events.find((m) => m.id ===  b.event2);
        if(!diagramFlowEventA || !diagramFlowEventB) {
            throw new Error("sortMapFlowEventInteractions - Could not find an event");
        }
        return diagramFlowEventA.row - diagramFlowEventB.row;
    });
}
export interface iToast {
    header: string;
    header2?: string;
    body: string;
}