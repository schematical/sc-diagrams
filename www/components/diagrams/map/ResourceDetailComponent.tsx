import React, {ChangeEvent, FormEvent, useState} from 'react';


import {DiagramObject, FlowEvent, FlowEventInteraction, FlowEventInteractionEvent, Resource} from "../util";
import MDEditor from "@uiw/react-md-editor";
import {ContextStore} from "@uiw/react-md-editor/src/Context";

interface ResourceDetailComponentProps {
    diagramObjects: DiagramObject[];
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
    function onToggleFloat(event: any) {
        const newState = {
            ...state,
            resource:{
                ...state.resource,
                float: event.target.checked
            }
        };
        console.log("newState:", newState)
        setState(newState);
    }
    function handleClose() {
        setState({...state, showEdit: false});
    }

    function onSave() {
        handleClose();
        props.onSave(state.resource);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                <div className="border-t border-slate-200 dark:border-slate-700">
                    {/* Components */}
                    <div className="space-y-8 mt-8 px-5">
                        <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                            Resource
                            Detail
                        </h2>
                        <div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="id">
                                    ID:
                                </label>
                                <input className="form-input w-full" type="text" placeholder="ID"
                                       readOnly={true}
                                       id="id" name="id" value={state.resource?.id}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="selectedTileX">
                                    X
                                </label>
                                <input className="form-input w-full" type="text" placeholder="Y"
                                       readOnly={true}
                                       id="x" value={state.resource?.x}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="selectedTileY">
                                    Y
                                </label>
                                <input className="form-input w-full" type="text" placeholder="Y"
                                       readOnly={true}
                                       id="y" value={state.resource?.y}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input className="form-input w-full" type="text" placeholder="Name"
                                       id="name" name="name" value={state.resource?.name}
                                       onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"
                                       htmlFor="objectId">
                                    Update Object
                                </label>
                                <select className="form-select"
                                        id="objectId"
                                        name="objectId"
                                        value={state.resource?.objectId}
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
                                <label className="block text-sm font-medium mb-1" htmlFor="sizeMultiplier">
                                    Size Multiplier
                                </label>
                                <input className="form-input w-full" type="number" placeholder="Size Multiplier"

                                       id="sizeMultiplier" name="sizeMultiplier" value={state.resource?.sizeMultiplier}
                                       onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="sizeMultiplier">
                                    Float
                                </label>
                                <div className="form-switch">
                                    <input type="checkbox" id="switch-2" className="sr-only"
                                           checked={state.resource.float || false}
                                           onChange={onToggleFloat}/>
                                    <label className="bg-slate-400 dark:bg-slate-700" htmlFor="switch-2">
                                        <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                        <span className="sr-only">Float</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-wrap -space-x-px pt-5">
                                <button
                                    className='btn bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-l-transparent'
                                    onClick={onSave}>Save changes
                                </button>
                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                    type="button"
                                    onClick={() => setState({...state, showEdit: true})}>Notes
                                </button>
                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-indigo-100 rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"
                                    type="button"
                                    onClick={onDelete}>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                props.pageMode === 'view' &&
                <>
                    <div className="border-t border-slate-200 dark:border-slate-700">
                        {/* Components */}
                        <div className="space-y-8 mt-8 px-5">
                            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                                {state.resource.name}
                            </h2>

                            <MDEditor.Markdown source={props.resource.notes as string}/>
                            {/*<div className="wmde-markdown" dangerouslySetInnerHTML={{__html: (marked.parse(props.resource.notes as string) as string)}} />*/}
                        </div>
                    </div>
                </>
            }
        </>
    );

}

export default ResourceDetailComponent;