import React, {ChangeEvent, FormEvent, useState} from 'react';

import {FlowEvent, FlowEventInteraction, FlowEventInteractionEvent} from "../util";
import MDEditor from "@uiw/react-md-editor";
import {ContextStore} from "@uiw/react-md-editor/src/Context";
import ModalBasic from "@/components/modal-basic";

interface MapFlowEventInteractionDetailComponentProps {
    mapFlowEventInteraction: FlowEventInteraction;

    onDelete: (mapFlowEventInteraction: FlowEventInteraction) => void;
    onSave: (mapFlowEventInteraction: FlowEventInteraction) => void;
}

interface MapFlowEventInteractionDetailComponentState {
    mapFlowEventInteraction: FlowEventInteraction;
    showEdit?: boolean;
}

const MapFlowEventInteractionDetailComponent = (props: MapFlowEventInteractionDetailComponentProps) => {

    const [state, setState] = useState<MapFlowEventInteractionDetailComponentState>({
        mapFlowEventInteraction: props.mapFlowEventInteraction
    });
    if (props.mapFlowEventInteraction.id !== state.mapFlowEventInteraction.id) {
        setState({
            ...state,
            mapFlowEventInteraction: props.mapFlowEventInteraction
        });
    }

    /*    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const mapFlowEvent = state.mapFlowEvent;
            (mapFlowEvent as any)[event.target.name] = event.target.value;

            setState({
                ...state,
                mapFlowEvent
            });
        }*/


    function onDelete() {
        props.onDelete(state.mapFlowEventInteraction);
    }

    const setValue = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, contextStore?: ContextStore) => {
        const mapFlowEventInteraction = state.mapFlowEventInteraction;
        mapFlowEventInteraction.payload = {
            ...mapFlowEventInteraction.payload,
            notes: value || ""
        }
        setState({
            ...state,
            mapFlowEventInteraction
        });
    }

    function handleClose() {
        setState({...state, showEdit: false});
    }

    function onSave() {
        handleClose();
        props.onSave(state.mapFlowEventInteraction);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const mapFlowEventInteraction = state.mapFlowEventInteraction;
        mapFlowEventInteraction.payload = mapFlowEventInteraction.payload || {};
        (mapFlowEventInteraction as any).payload[event.target.name] = event.target.value;
        setState({
            ...state,
            mapFlowEventInteraction
        });
    }

    return (
        <div className="border-t border-slate-200 dark:border-slate-700">
            {/* Components */}
            <div className="space-y-8 mt-8 px-5">
                <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">Interaction Detail</h2>
                {/*<div>
                     Start
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="default">
                            Id
                        </label>
                        <input className="form-input w-full" type="text" placeholder="Id" readOnly={true}
                               id="id" name="id" value={state.mapFlowEvent.id} onChange={handleChange}
                        />
                    </div>
                     End
                </div>*/}
                <div className="flex flex-wrap -space-x-px">
                    <button
                        className="btn bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r"
                        onClick={() => setState({...state, showEdit: true})}>
                        Edit
                    </button>
                    <button
                        className="btn bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r"
                        onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>

            <div
                className="modal show"
                style={{display: 'block', position: 'initial'}}
            >
                <ModalBasic isOpen={!!state.showEdit} setIsOpen={handleClose} title="Basic Modal">
                    {/* Modal content */}
                    <div className="px-5 pt-4 pb-1">
                        <div className="text-sm">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Id</span>
                                </div>
                                <input type="text" className="form-control"
                                       id="id" name="id" readOnly={true} value={state.mapFlowEventInteraction.id}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Text</span>
                                </div>
                                <input type="text" className="form-control"
                                       id="text" name="text" value={state.mapFlowEventInteraction.payload?.text}
                                       onChange={handleChange}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Speed</span>
                                </div>
                                <input type="number" className="form-control"
                                       id="speed" name="speed" value={state.mapFlowEventInteraction.payload?.speed}
                                       onChange={handleChange}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Repeat</span>
                                </div>
                                <input type="number" className="form-control"
                                       id="repeat" name="repeat" value={state.mapFlowEventInteraction.payload?.repeat}
                                       onChange={handleChange}/>
                            </div>
                            <h4>Notes</h4>
                            <MDEditor
                                value={state.mapFlowEventInteraction.payload?.notes}
                                onChange={setValue}
                            />
                        </div>
                    </div>
                    {/* Modal footer */}
                    <div className="px-5 py-4">
                        <div className="flex flex-wrap justify-end space-x-2">
                            <button
                                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                                onClick={handleClose}>Close
                            </button>
                            <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                    onClick={onSave}>Save
                            </button>
                        </div>
                    </div>
                </ModalBasic>

            </div>
        </div>
    );


}

export default MapFlowEventInteractionDetailComponent;