import {Diagram, DiagramLayer, Resource} from "./util";
import React, {ChangeEvent, useState} from "react";
import {DiagramPageState} from "@/services/interfaces";


interface DiagramLayersListComponentProps {
    diagramPageState: DiagramPageState;
    onDelete: ( selectedDiagramLayer: DiagramLayer) => void;
    onSave: ( selectedDiagramLayer: DiagramLayer) => void;
    onSelectDiagramLayer: ( selectedDiagramLayer: DiagramLayer) => void;
}
interface DiagramLayersListComponentState {
    selectedDiagramLayer?: DiagramLayer,

}


export const DiagramLayersListComponent = (props: DiagramLayersListComponentProps) => {
    const [state, setState] = useState<DiagramLayersListComponentState>({
        selectedDiagramLayer: props.diagramPageState.selectedDiagramLayer || undefined
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagramLayer = state.selectedDiagramLayer;
        (selectedDiagramLayer as any)[event.target.name] = event.target.value;
        setState({
            ...state,
            selectedDiagramLayer
        });
    }
/*
    function onDelete() {

    }

    function onSave() {

    }*/

    return <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="space-y-8 mt-8 px-5">

            <div className="mt-4">
                <div
                    className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-3">
                    Layer List
                </div>
                <ul className="mb-6">
                    {
                        props.diagramPageState.diagram?.data?.layers?.map((diagramLayer: DiagramLayer, index) => {
                            return <li className="pb-2">
                                <button
                                    className="flex items-center justify-between w-full p-2 rounded bg-indigo-500/30"
                                    onClick={() => props.onSelectDiagramLayer(diagramLayer)}
                                >
                                    <div className="flex items-center truncate">
                                        <div className="truncate">
                                            <span
                                                className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                 {diagramLayer.name}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        })
                    }

                </ul>


                {
                    state.selectedDiagramLayer &&
                    <div className="border-t border-slate-200 dark:border-slate-700">
                        {/* Components */}
                        <div className="space-y-8 mt-8 px-5">
                            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                                Layer
                                Detail
                            </h2>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input className="form-input w-full" type="text" placeholder="ID"
                                       id="name" name="name" onChange={handleChange}
                                       value={state.selectedDiagramLayer.name}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="id">
                                    ID
                                </label>
                                <input className="form-input w-full" type="text" placeholder="ID"
                                       id="id" name="id" readOnly={true} onChange={handleChange}
                                       value={state.selectedDiagramLayer.id}
                                />
                            </div>



                            <div className="flex flex-wrap items-center -m-1.5">
                                <div className="m-1.5">
                                    <div className="flex flex-wrap -space-x-px">
                                        <button
                                            className="btn bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-l-transparent"
                                            onClick={() => props.onSave(state.selectedDiagramLayer as DiagramLayer)}>
                                            Save changes
                                        </button>
                                        <button
                                            className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                            onClick={() => props.onSelectDiagramLayer(state.selectedDiagramLayer as DiagramLayer)}>
                                            View Groups
                                        </button>
                                        <button
                                            className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                            onClick={() => props.onSave(state.selectedDiagramLayer as DiagramLayer)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                }
                {
                    !state.selectedDiagramLayer &&
                    <button className="btn btn-block btn-outline-primary" onClick={() => {
                        const selectedDiagramLayer = {
                            id: 'dl-' + Math.floor(Math.random() * 99999),
                            name: "",
                            tileGroups: []
                        }
                        setState({
                            ...state,
                            selectedDiagramLayer
                        });
                    }}>
                        Add New
                    </button>
                }


            </div>
        </div>
    </div>;
    {/*

    </>;*/
    }
}