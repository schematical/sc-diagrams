import {Diagram, DiagramLayer, Resource, TileGroup} from "./util";
import React, {ChangeEvent, useState} from "react";
import {ButtonGroup, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { DiagramPageState } from "../../pages/diagrams/DiagramPage";

interface DiagramLayersDetailComponentProps {
    onSelectBoarders:  ( tileGroup: TileGroup) => void;
    diagramPageState: DiagramPageState;
    onDelete: ( tileGroup: TileGroup) => void;
    onSave: ( tileGroup: TileGroup) => void;
    onSelectDiagramLayerTileGroup: ( tileGroup: TileGroup) => void;
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

    return <>
        <h3>Layer: {props.diagramPageState.selectedDiagramLayer?.name}</h3>
        <h4>Tile Groups</h4>
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu">

            <li className="nav-item">
                {
                    props.diagramPageState.selectedDiagramLayer?.tileGroups.map((tileGroup: TileGroup, index) => {
                        return <a href='#'
                                  className="nav-link align-middle px-0"
                                  onClick={() => {
                                      setState({
                                          selectedDiagramLayerTileGroup: tileGroup
                                      });
                                      props.onSelectDiagramLayerTileGroup(tileGroup);
                                  }}>
                            <i className="fs-4 bi-house"></i>
                            <span className="ms-1 d-none d-sm-inline">
                               {tileGroup.name}
                                {
                                    tileGroup.startPos &&
                                    <span> Start: {tileGroup.startPos.x}/{tileGroup.startPos.y} </span>
                                }
                                {
                                    tileGroup.endPos &&
                                    <span> Start: {tileGroup.endPos.x}/{tileGroup.endPos.y} </span>
                                }
                            </span>
                        </a>
                    })
                }

            </li>
        </ul>
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
                    <div className="input-group mb-3">
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


                    </div>

                    <ButtonGroup>
                        <Button variant="primary"
                                onClick={() => props.onSave(state.selectedDiagramLayerTileGroup as TileGroup)}>
                            Save
                        </Button>
                        <button className="btn btn-outline-primary" type="button"
                                onClick={() => props.onSelectBoarders(state.selectedDiagramLayerTileGroup as TileGroup)}>
                            Select Borders
                        </button>
                        <button className="btn btn-outline-danger" type="button"
                                onClick={() => props.onDelete(state.selectedDiagramLayerTileGroup as TileGroup)}>
                            Delete
                        </button>
                    </ButtonGroup>
                </div>
            </>
        }
        {
            // !props.diagramPageState.selectedDiagramLayerTileGroup &&
            <button className="btn btn-block btn-outline-primary" onClick={() => {
                const selectedDiagramLayerTileGroup = {
                    id: 'dl-' + Math.floor(Math.random() * 99999),
                    name: "",
                   /* startPos: {
                        x: 0,
                        y: 0
                    },
                    endPos: {
                        x: 0,
                        y: 0
                    }*/
                }
                setState({
                    ...state,
                    selectedDiagramLayerTileGroup,
                });
            }}>
                Add New
            </button>
        }
    </>;
}