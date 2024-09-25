import React, {ChangeEvent, FormEvent, useState} from 'react';
import {DiagramObject, FlowEvent, FlowEventDecisionOption, FlowEventInteraction} from "../util";

interface MapFlowEventDetailComponentProps {
    diagramObjects: DiagramObject[];
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
        switch (event.target.name) {
            case('updatedDiagramObjectId'):
                if (event.target.value === 'None') {
                    mapFlowEvent.updatedDiagramObjectId = undefined;
                }
                break;
        }
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
            <div className="border-t border-slate-200 dark:border-slate-700">
                {/* Components */}
                <div className="space-y-8 mt-8 px-5">
                    <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">Event Detail</h2>
                    <div>
                        {/* Start */}
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="default">
                                Id
                            </label>
                            <input className="form-input w-full" type="text" placeholder="Id" readOnly={true}
                                   id="id" name="id" value={state.mapFlowEvent.id} onChange={handleChange}
                            />
                        </div>
                        {/* End */}
                    </div>
                    <div>
                        {/* Start */}
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="default">
                                Text
                            </label>
                            <input className="form-input w-full" type="text" placeholder="Text"
                                   id="text" name="text" value={state.mapFlowEvent.text} onChange={handleChange}/>
                        </div>
                        {/* End */}
                    </div>
                    <div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="default">
                                Row
                            </label>
                            <input className="form-input w-full" type="text" placeholder="Row" readOnly={true}
                                   id="row" name="row" value={state.mapFlowEvent.row} onChange={handleChange}/>
                        </div>

                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1"
                               htmlFor="updatedDiagramObjectId">
                            Update Object
                        </label>
                        <select className="form-select"
                                id="updatedDiagramObjectId"
                                name="updatedDiagramObjectId"
                                value={state.mapFlowEvent?.updatedDiagramObjectId}
                                onChange={handleChange}>
                            <option value={undefined}>None</option>
                            {
                                props.diagramObjects && props.diagramObjects.map((diagramObject, index) => {
                                    return <option key={index} value={diagramObject._id}>
                                        {diagramObject.title}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="country">
                            Type
                        </label>
                        <select className="form-select"
                                id="type"
                                name="type"
                                value={state.mapFlowEvent.type}
                                onChange={handleChange}>
                            <option value="none">None</option>
                            <option value="decision">Decision</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap -space-x-px">
                        <button
                            className="btn bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r"
                            onClick={onUpdate}>
                            Save
                        </button>
                        {
                            state.mapFlowEvent.type !== 'decision' &&
                            <button
                                className="btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-none first:rounded-l last:rounded-r"
                                onClick={onConnect}>
                                Connect
                            </button>
                        }
                        {
                            <button
                                className="btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-none first:rounded-l last:rounded-r"
                                onClick={onDelete}>
                                Delete
                            </button>
                        }
                        {
                            state.mapFlowEvent.type === 'decision' &&
                            <button
                                className="btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-none first:rounded-l last:rounded-r"
                                onClick={onAddOption}>Add Option
                            </button>
                        }
                    </div>
                    {
                        state.mapFlowEvent.options &&
                        <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">Options</h2>
                    }
                    {
                        state.mapFlowEvent.options &&
                        state.mapFlowEvent.options.map((option, index) => {
                            return <>
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="default">
                                        Option Name
                                    </label>
                                    <input className="form-input w-full" type="text" placeholder="Option Name"
                                           value={option.text}
                                           onChange={(event: any) => {
                                               if (!state.mapFlowEvent.options) throw new Error("Missing `state.mapFlowEvent.options`");
                                               const options = state.mapFlowEvent.options;
                                               options[index].text = event.target.value;

                                               setState({
                                                   ...state,
                                                   mapFlowEvent: {
                                                       ...state.mapFlowEvent,
                                                       options
                                                   }
                                               });
                                           }}/>
                                </div>
                                <div className="flex flex-wrap -space-x-px">
                                    <button
                                        className="btn bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            props.onConnectOptionClick(props.mapFlowEvent, option);
                                        }}>
                                        Connect
                                    </button>
                                    <button
                                        className="btn bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-indigo-500 rounded-none first:rounded-l last:rounded-r"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (!state.mapFlowEvent.options) throw new Error("Missing `state.mapFlowEvent.options`");
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
                            </>
                        })
                    }
                </div>
            </div>
        </>);

    /*



         <div className="input-group">
             {/!* <select name="selectedDiagramObjectId" className="custom-select" id="inputGroupSelect04" onChange={handleChange}>
                                         <option value="NONE">None</option>
                                         {
                                             state.diagramObjects && state.diagramObjects.map((diagramObject) => {
                                                 return <option value={diagramObject.ObjectId}>
                                                     {diagramObject.title}
                                                 </option>
                                             })
                                         }

                                     </select>*!/}
             <div className="input-group-append">
                 {/!*<button className="btn btn-outline-secondary" type="button"
                         onClick={onAddResourceInteractionClick}>Add Interaction
                 </button>
                 <button className="btn btn-outline-danger" type="button"
                         onClick={onDeleteResourceClick}>Delete
                 </button>*!/}
             </div>
         </div>
     </>
 );*/

}

export default MapFlowEventDetailComponent;