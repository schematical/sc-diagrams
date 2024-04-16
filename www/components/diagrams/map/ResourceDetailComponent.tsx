import React, {ChangeEvent, FormEvent, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {FlowEvent, FlowEventInteraction, FlowEventInteractionEvent, Resource} from "../util";
import MDEditor from "@uiw/react-md-editor";
import {ContextStore} from "@uiw/react-md-editor/src/Context";
import {ButtonGroup} from "react-bootstrap";

interface ResourceDetailComponentProps {
    pageMode: 'view' | 'edit';
    resource: Resource;

    onDelete: (resource: Resource) => void;
    onSave: (resource: Resource) => void;
}
interface ResourceDetailComponentState {
    resource: Resource;
    showEdit?: boolean;
}
const ResourceDetailComponent = (props: ResourceDetailComponentProps) => {

    const [state, setState] = useState<ResourceDetailComponentState>({
        resource: props.resource
    });
    if (props.resource.id !== state.resource.id) {
        setState({
            ...state,
            resource: props.resource
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
        props.onDelete(state.resource);
    }

    const setValue = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, contextStore?: ContextStore) => {
        const resource = state.resource;
        resource.notes = value || "";
        setState({
            ...state,
            resource
        });
    }

    function handleClose() {
        setState({...state, showEdit: false });
    }

    function onSave() {
        handleClose();
        props.onSave(state.resource);
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const resource = state.resource;
        (resource as any)[event.target.name] = event.target.value;
        setState({
            ...state,
            resource
        });
    }

    return (

        <>
            {
                props.pageMode === 'edit' &&
                <>
                    <h3>Resource</h3>
                    <div className="form-group">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Id</span>
                            </div>
                            <input type="text" className="form-control"
                                   id="id" name="id" readOnly={true} value={state.resource.id}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">X</span>
                            </div>
                            <input type="text" className="form-control"
                                   id="x" name="x" readOnly={true} value={state.resource.x}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Y</span>
                            </div>
                            <input type="text" className="form-control"
                                   id="y" name="y" readOnly={true} value={state.resource.y}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">name</span>
                            </div>
                            <input type="text" className="form-control"
                                   id="name" name="name" value={state.resource.name} onChange={handleChange}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Size Multiplier</span>
                            </div>
                            <input className="form-control"
                                   id="sizeMultiplier" name="sizeMultiplier" type="number" value={state.resource.sizeMultiplier} onChange={handleChange}/>
                        </div>

                        <ButtonGroup>
                            <Button variant="primary" onClick={onSave}>Save changes</Button>
                            <button className="btn btn-outline-primary" type="button"
                                    onClick={() => setState({...state, showEdit: true })}>Notes
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

                                <h4>Notes</h4>
                                <MDEditor
                                    value={state.resource.notes}
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
            }
            {
                props.pageMode === 'view' &&
                <>
                   <h3>{state.resource.name}</h3>
                    <MDEditor.Markdown source={props.resource.notes as string} />
                    {/*<div className="wmde-markdown" dangerouslySetInnerHTML={{__html: (marked.parse(props.resource.notes as string) as string)}} />*/}
                </>
            }
        </>
    );

}

export default ResourceDetailComponent;