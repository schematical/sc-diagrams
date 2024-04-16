import {Diagram, DiagramLayer, Resource} from "./util";
import React, {ChangeEvent, useState} from "react";
import {ButtonGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { DiagramPageState } from "../../pages/diagrams/DiagramPage";

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

    return <>
        <h3>Layers</h3>
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu">

            <li className="nav-item">
                {
                    props.diagramPageState.diagram?.data?.layers?.map((diagramLayer: DiagramLayer) => {
                        return <a href='#'
                                  className="nav-link align-middle px-0"
                                  onClick={() => props.onSelectDiagramLayer(diagramLayer) }>
                            <i className="fs-4 bi-house"></i>
                            <span className="ms-1 d-none d-sm-inline">
                                                           {diagramLayer.name}
                                                        </span>
                        </a>
                    })
                }

            </li>
        </ul>
        {
            state.selectedDiagramLayer &&
            <>
                <h3>Resource</h3>
                <div className="form-group">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" className="form-control"
                               id="name" name="name" onChange={handleChange} value={state.selectedDiagramLayer.name}/>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" className="form-control"
                               id="id" name="id" readOnly={true} onChange={handleChange} value={state.selectedDiagramLayer.id}/>
                    </div>


                    <ButtonGroup>
                        <Button variant="primary" onClick={() => props.onSave(state.selectedDiagramLayer as DiagramLayer)}>Save changes</Button>
                        <button className="btn btn-outline-primary" type="button"
                                onClick={() => props.onSelectDiagramLayer(state.selectedDiagramLayer as DiagramLayer) }>
                            View Groups
                        </button>
                        <button className="btn btn-outline-danger" type="button"
                                onClick={() => props.onSave(state.selectedDiagramLayer as DiagramLayer)}>Delete
                        </button>
                    </ButtonGroup>
                </div>
            </>
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
    </>;
}