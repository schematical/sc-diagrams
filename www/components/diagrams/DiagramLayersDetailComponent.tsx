import {Diagram, DiagramLayer, Resource, TileGroup} from "./util";
import React, {ChangeEvent, useState} from "react";
import {DiagramPageState} from "@/services/interfaces";


interface DiagramLayersDetailComponentProps {
    onSelectBoarders: (tileGroup: TileGroup) => void;
    diagramPageState: DiagramPageState;
    onDelete: (tileGroup: TileGroup) => void;
    onSave: (tileGroup: TileGroup) => void;
    onSelectDiagramLayerTileGroup: (tileGroup: TileGroup) => void;
}

interface DiagramLayersDetailComponentState {
    selectedDiagramLayerTileGroup?: TileGroup,

}

export const DiagramLayersDetailComponent = (props: DiagramLayersDetailComponentProps) => {

    const [state, setState] = useState<DiagramLayersDetailComponentState>({
        selectedDiagramLayerTileGroup: props.diagramPageState.selectedDiagramLayerTileGroup || undefined
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagramLayerTileGroup = state.selectedDiagramLayerTileGroup;
        (selectedDiagramLayerTileGroup as any)[event.target.name] = event.target.value;
        setState({
            ...state,
            selectedDiagramLayerTileGroup
        });
    }

    return <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="space-y-8 mt-8 px-5">

            <div className="mt-4">
                <div
                    className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-3">
                    Layer: {props.diagramPageState.selectedDiagramLayer?.name}
                </div>
                <ul className="mb-6">
                    {
                        props.diagramPageState.selectedDiagramLayer?.tileGroups.map((tileGroup: TileGroup, index) => {
                            return <li className="pb-2">
                                <button
                                    className="flex items-center justify-between w-full p-2 rounded bg-indigo-500/30"
                                    onClick={() => {
                                        setState({
                                            selectedDiagramLayerTileGroup: tileGroup
                                        });
                                        props.onSelectDiagramLayerTileGroup(tileGroup);
                                    }}>
                                    <div className="flex items-center truncate">
                                        <div className="truncate">
                                            <span
                                                className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                    {tileGroup.name}
                                                <div
                                                    className="text-xs font-medium text-slate-500">
                                                {
                                                    tileGroup.startPos &&
                                                    <span> Start: {tileGroup.startPos.x}/{tileGroup.startPos.y} </span>
                                                }
                                                    {
                                                        tileGroup.endPos &&
                                                        <span> Start: {tileGroup.endPos.x}/{tileGroup.endPos.y} </span>
                                                    }
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </li>;
                        })
                    }
                </ul>


                {
                    state.selectedDiagramLayerTileGroup &&
                    <div className="border-t border-slate-200 dark:border-slate-700">
                        {/* Components */}
                        <div className="space-y-8 mt-8 px-5">
                            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                                Tile Group
                            </h2>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="id">
                                    Id
                                </label>
                                <input className="form-input w-full" type="text" placeholder="Id"
                                       id="id" name="id" onChange={handleChange}
                                       value={state.selectedDiagramLayerTileGroup.id}/>
                            </div>

                            <div className="input-group mb-3">
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input type="text" className="form-control"
                                       id="name" name="name" onChange={handleChange}
                                       value={state.selectedDiagramLayerTileGroup.name}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                <span className="input-group-text">Color</span>
                                </div>
                                <input type="color" className="form-control"
                                       id="color" name="color" onChange={handleChange}
                                       value={state.selectedDiagramLayerTileGroup.color}/>
                            </div>

                            <div className="flex flex-wrap items-center -m-1.5">
                                <div className="m-1.5">

                                    <div className="flex flex-wrap -space-x-px">
                                        <button
                                            className="btn bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-l-transparent"
                                            onClick={() => props.onSave(state.selectedDiagramLayerTileGroup as TileGroup)}>
                                            Save
                                        </button>
                                        <button
                                            className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                            onClick={() => props.onSelectBoarders(state.selectedDiagramLayerTileGroup as TileGroup)}>
                                            Select Borders
                                        </button>
                                        <button
                                            className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                            onClick={() => props.onDelete(state.selectedDiagramLayerTileGroup as TileGroup)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    // !props.diagramPageState.selectedDiagramLayerTileGroup &&
                    <button className="btn btn-block btn-outline-primary" onClick={() => {
                        const selectedDiagramLayerTileGroup = {
                            id: 'dl-' + Math.floor(Math.random() * 99999),
                            name: "",

                        }
                        setState({
                            ...state,
                            selectedDiagramLayerTileGroup,
                        });
                    }}>
                        Add New
                    </button>
                }


            </div>
        </div>
    </div>;
    /*<h3></h3>
    <h4>Tile Groups</h4>

{
    state.selectedDiagramLayerTileGroup &&
    <>
    <h3>Tile Group</h3>
<div className="form-group">
<div className="input-group mb-3">
    <div className="input-group-prepend">
        <span className="input-group-text">Name</span>
    </div>
    <input type="text" className="form-control"
           id="name" name="name" onChange={handleChange}
           value={state.selectedDiagramLayerTileGroup.name}/>
</div>
<div className="input-group mb-3">
    <div className="input-group-prepend">
        <span className="input-group-text">Name</span>
    </div>
    <input type="text" className="form-control"
           id="id" name="id" onChange={handleChange}
           value={state.selectedDiagramLayerTileGroup.id}/>
</div>
{/!*<div className="input-group mb-3">
    <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
    <Form.Control
        type="color"
        id="color"
        name="color"
        defaultValue="#550a51"
        title="Choose your color"
        onChange={handleChange}
        value={state.selectedDiagramLayerTileGroup.color}
    />


</div>*!/}
<div className="flex flex-wrap items-center -m-1.5">
    <div className="m-1.5">
        {/!* Start *!/}
        <div className="flex flex-wrap -space-x-px">
            <button
                className="btn bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-l-transparent"
                onClick={() => props.onSave(state.selectedDiagramLayerTileGroup as TileGroup)}>
                Save
            </button>
            <button
                className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"  onClick={() => props.onSelectBoarders(state.selectedDiagramLayerTileGroup as TileGroup)}>
                Select Borders
            </button>
            <button
                className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                onClick={() => props.onDelete(state.selectedDiagramLayerTileGroup as TileGroup)}>
                Delete
            </button>
        </div>
        {/!* End *!/}
    </div>
</div>
</div>
</>
}
{
// !props.diagramPageState.selectedDiagramLayerTileGroup &&
<button className="btn btn-block btn-outline-primary" onClick={() => {
const selectedDiagramLayerTileGroup = {
id: 'dl-' + Math.floor(Math.random() * 99999),
name: "",
/!* startPos: {
    x: 0,
    y: 0
},
endPos: {
    x: 0,
    y: 0
}*!/
}
setState({
...state,
selectedDiagramLayerTileGroup,
});
}}>
Add New
</button>
}
</>;*/
}