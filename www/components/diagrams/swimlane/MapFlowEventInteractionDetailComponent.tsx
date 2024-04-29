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

        <>
            <h3>Interaction</h3>
            <div className="form-group">
                {/*<div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Id</span>
                    </div>
                    <input type="text" readOnly={true} className="form-control"
                           id="id" name="id" value={state.mapFlowEvent.id} onChange={handleChange}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Text</span>
                    </div>
                    <input type="text" readOnly={false} className="form-control"
                           id="text"  name="text" value={state.mapFlowEvent.text}  onChange={handleChange}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Row</span>
                    </div>
                    <input type="text" readOnly={false} className="form-control"
                           id="row"  name="row"  value={state.mapFlowEvent.row}  onChange={handleChange}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Type</span>
                    </div>
                    <select  className="form-control"
                           id="type"
                             name="type"
                             value={state.mapFlowEvent.type}
                             onChange={handleChange}
                    >
                        <option value="none">None</option>
                        <option value="decision">Decision</option>
                    </select>
                </div>*/}

                <div>

                    <button className="btn btn-outline-primary" type="button"
                            onClick={() => setState({...state, showEdit: true})}>Edit
                    </button>
                    <button className="btn btn-outline-danger" type="button"
                            onClick={onDelete}>Delete
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
        </>
    );

}

export default MapFlowEventInteractionDetailComponent;