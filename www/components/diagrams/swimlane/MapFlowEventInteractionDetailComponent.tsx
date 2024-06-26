import React, {ChangeEvent, FormEvent, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {FlowEvent, FlowEventInteraction, FlowEventInteractionEvent} from "../util";
import MDEditor from "@uiw/react-md-editor";
import {ContextStore} from "@uiw/react-md-editor/src/Context";
import {ButtonGroup} from "react-bootstrap";
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
        setState({...state, showEdit: false });
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

                <ButtonGroup>

                    <button className="btn btn-outline-primary" type="button"
                            onClick={() => setState({...state, showEdit: true })}>Edit
                    </button>
                    <button className="btn btn-outline-danger" type="button"
                            onClick={onDelete}>Delete
                    </button>
                </ButtonGroup>
            </div>
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
            <Modal show={state.showEdit} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event Interaction</Modal.Title>
                </Modal.Header>

                <Modal.Body>
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
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={onSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            </div>
        </>
    );

}

export default MapFlowEventInteractionDetailComponent;