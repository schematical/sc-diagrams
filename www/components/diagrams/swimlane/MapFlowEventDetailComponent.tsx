import React, {ChangeEvent, FormEvent, useState} from 'react';
import {FlowEvent, FlowEventDecisionOption, FlowEventInteraction} from "../util";

interface MapFlowEventDetailComponentProps {
    mapFlowEvent: FlowEvent;
    onUpdate: (mapFlowEvent: FlowEvent) => void;
    onConnect: (mapFlowEvent: FlowEvent) => void

    onDelete: (mapFlowEvent: FlowEvent) => void;

    onConnectOptionClick(mapFlowEvent: FlowEvent, option: FlowEventDecisionOption): void;
}
interface MapFlowEventDetailComponentState {
    mapFlowEvent: FlowEvent;
}
const MapFlowEventDetailComponent = (props: MapFlowEventDetailComponentProps) => {

    const [state, setState] = useState<MapFlowEventDetailComponentState>({
        mapFlowEvent: props.mapFlowEvent
    });
    if (props.mapFlowEvent.id !== state.mapFlowEvent.id) {
        setState({
            ...state,
            mapFlowEvent: props.mapFlowEvent
        });
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const mapFlowEvent = state.mapFlowEvent;
        (mapFlowEvent as any)[event.target.name] = event.target.value;

        setState({
            ...state,
            mapFlowEvent
        });
    }

    const onConnect = () => {
        props.onConnect(state.mapFlowEvent);
    }
    const onUpdate = () => {
        props.onUpdate(state.mapFlowEvent);
    }

    function onDelete() {
        props.onDelete(state.mapFlowEvent);
    }

    function onAddOption() {
        const mapFlowEvent = state.mapFlowEvent;
        mapFlowEvent.options = mapFlowEvent.options || [];
        mapFlowEvent.options.push({
            id: `opt-${Math.floor(Math.random() * 9999)}`,
            text: "Option " + mapFlowEvent.options.length
        });
        setState({
            ...state,
            mapFlowEvent: mapFlowEvent
        })
    }

    return (

        <>
            <h3>Resource Details</h3>
            <div className="form-group">
                <div className="input-group mb-3">
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
                </div>

                <div>
                    <button className="btn btn-outline-secondary" type="button"
                            onClick={onUpdate}>Update
                    </button>
                    {
                        state.mapFlowEvent.type !== 'decision' &&
                        <button className="btn btn-outline-secondary" type="button"
                                onClick={onConnect}>Connect
                        </button>
                    }
                    {
                        state.mapFlowEvent.type === 'decision' &&
                        <button className="btn btn-secondary" type="button"
                                onClick={onAddOption}>Add Option
                        </button>
                    }
                    <button className="btn btn-outline-danger" type="button"
                            onClick={onDelete}>Delete
                    </button>
                </div>
            </div>
            <form>
                {
                    state.mapFlowEvent.options &&
                    <h5>Options</h5>
                }
                {
                    state.mapFlowEvent.options &&
                    state.mapFlowEvent.options.map((option, index) => {
                        return <div className="form-row">
                            <div>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Option Name"
                                       value={option.text}
                                        onChange={(event: any) => {
                                            if(!state.mapFlowEvent.options) throw new Error("Missing `state.mapFlowEvent.options`");
                                            const options = state.mapFlowEvent.options;
                                            options[index].text = event.target.value;

                                            setState({
                                                ...state,
                                                mapFlowEvent: {
                                                    ...state.mapFlowEvent,
                                                    options
                                                }
                                            });
                                        }}
                                />



                                <button className="btn btn-primary" onClick={(event) => {
                                    event.preventDefault();
                                    props.onConnectOptionClick(props.mapFlowEvent, option);
                                }}>
                                    Connect
                                </button>
                                <button className="btn btn-danger" onClick={(event) => {
                                    event.preventDefault();
                                    if(!state.mapFlowEvent.options) throw new Error("Missing `state.mapFlowEvent.options`");
                                    const options = state.mapFlowEvent.options.filter((o) => {
                                        return o.id !== option.id;
                                    })

                                    setState({
                                        ...state,
                                        mapFlowEvent: {
                                            ...state.mapFlowEvent,
                                            options
                                        }
                                    });
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    })
                }
            </form>



            <div className="input-group">
                {/* <select name="selectedDiagramObjectId" className="custom-select" id="inputGroupSelect04" onChange={handleChange}>
                                            <option value="NONE">None</option>
                                            {
                                                state.diagramObjects && state.diagramObjects.map((diagramObject) => {
                                                    return <option value={diagramObject.ObjectId}>
                                                        {diagramObject.title}
                                                    </option>
                                                })
                                            }

                                        </select>*/}
                <div className="input-group-append">
                    {/*<button className="btn btn-outline-secondary" type="button"
                            onClick={onAddResourceInteractionClick}>Add Interaction
                    </button>
                    <button className="btn btn-outline-danger" type="button"
                            onClick={onDeleteResourceClick}>Delete
                    </button>*/}
                </div>
            </div>
        </>
    );

}

export default MapFlowEventDetailComponent;