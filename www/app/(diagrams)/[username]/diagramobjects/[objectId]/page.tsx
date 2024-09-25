"use client";
import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';

import axios from "axios";
import {useParams} from "next/navigation";
import {getJwt} from "@/services/util";
import {DiagramObject} from "@/components/diagrams/util";
import {GQLService} from "@/services/GQLService";
import {updateDiagramObject} from "@/services/graphql";

interface DiagramObjectEditPageState {
    loaded?: boolean;
    diagramobject?: any
}

const DiagramObjectEditPage = () => {
    const params = useParams();

    const [state, setState] = useState<DiagramObjectEditPageState>({
        diagramobject: {}
    });

    const refreshData = async () => {
        if (!params.objectId || params.objectId === 'new') {
            setState({
                loaded: true,
                // ...state,
                diagramobject: {
                    parentUri: params.username,
                    Username: params.username
                }
            })
            return
        }

        const res: DiagramObject[] = (await GQLService.getDiagramObjectById({
            parentUri: params.username,
            _id: params.objectId
        }));
        setState({
            loaded: true,
            // ...state,
            diagramobject: res
        })
    }
    /*    const setValue = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, contextStore?: ContextStore) => {
            const diagramobject = state.diagramobject;
            diagramobject.Body = value;
            console.log("setValue:", state.diagramobject);
            setState({
                ...state,
                post
            });
        }*/
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const diagramobject = state.diagramobject;
        diagramobject[event.target.name] = event.target.value;
        console.log("State.diagramobject:", state.diagramobject);
        setState({
            ...state,
            diagramobject
        });
    }
    const onSave = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        /*const token = await getJwt();
        const res = await axios.post(
           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.diagramobject.ObjectId}`,
           state.diagramobject,
           {
               headers: {
                   Authorization: token
               }
           }
       );*/

        const res: DiagramObject = (await GQLService.updateDiagramObject({
            _id: state.diagramobject._id,
            parentUri: state.diagramobject.parentUri,
            title: state.diagramobject.title,
            description: state.diagramobject.description,
            imageSrc: state.diagramobject.imageSrc,
            jsonSrc: state.diagramobject.jsonSrc
        }));
        setState({
            loaded: true,
            // ...state,
            diagramobject: res
        })
    }
    const handleUploadChange = async (event: any) => {
        event.preventDefault();

        // const token = await getJwt();
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        const extension = files[0].name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
            reader.onload = async () => {
                resolve()
            }
            reader.readAsDataURL(files[0]);
        });
        let key = event.target.name;

        switch (key) {
            case('imageSrcFile'):
                key = files[0].name.substr(0, files[0].name.length - (extension.length + 1));
                break;
        }
        let propertyName = null;
        switch (event.target.name) {
            case('imageSrcFile'):
                propertyName = 'imageSrc';
                break;
            case('jsonSrcFile'):
                propertyName = 'jsonSrc';
                break;
            default:
                throw new Error(`Unsure what to do with '${event.target.name}'`);

        }
        /*const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.diagramobject.ObjectId}/upload`,
            {
                extension,
                key
            },
            {
                headers: {
                    Authorization: token
                }
            }
        );*/
        const res = await GQLService.uploadDiagramObject({
            _id: state.diagramobject._id,
            parentUri: state.diagramobject.parentUri,
            extension,
            key
        })
        const signedUrl = res.signedUrl;
        const result = await fetch(signedUrl, {
            method: "PUT",
            body: dataURItoBlob(reader.result as string),
        });
        const newState = {
            ...state,
            diagramobject: {
                ...state.diagramobject,
                [propertyName]: res.url
            }
        };
        console.log("newState: ", newState);
        setState(newState);
    }

    function dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;

    }

    useEffect(() => {
        if (state.loaded) {
            return;
        }
        const token = localStorage.getItem('accessToken');
        if (!token) {
            document.location.href = '/';
        }
        refreshData();
    });


    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px ml-5 mt-5 mb-5">
                    {state.diagramobject &&
                        <section>
                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Diagram Object</h2>
                            {/*<div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia
                                deserunt mollit.
                            </div>*/}
                            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">ObjectId</label>
                                    <input id="_id" className="form-input w-full" name="_id"
                                           value={state.diagramobject._id}
                                           onChange={handleChange} type='text'/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="business-id">Title</label>
                                    <input id='title' name="title" className="form-input w-full"
                                           value={state.diagramobject.title}
                                           onChange={handleChange} type='text'/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="location">Description</label>
                                    <input id="description" name="description"
                                           value={state.diagramobject.description} onChange={handleChange}
                                           className="form-input w-full" type="text"/>
                                </div>
                            </div>
                            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">ImageSRC</label>
                                    <input id="imageSrc" className="form-input w-full" name="imageSrc" type='text'
                                           value={state.diagramobject?.imageSrc} onChange={handleChange}/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="imageSrcFile">ImageSRC
                                        File
                                        Upload</label>
                                    <input name="imageSrcFile" className="form-control" type='file' accept="audio/*,video/*,image/*"
                                           onChange={handleUploadChange}/>
                                </div>

                            </div>
                            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="jsonSrc">JSON SRC</label>
                                    <input id="jsonSrc" className="form-input w-full" name="jsonSrc" type='text'
                                           value={state.diagramobject.jsonSrc} onChange={handleChange}
                                           accept="text/*"
                                    />
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="jsonSrcFile">jsonSrc File
                                        Upload</label>
                                    <input id="jsonSrcFile" className="form-input w-full" name="jsonSrcFile" type='file'
                                           onChange={handleUploadChange}/>
                                </div>

                            </div>
                        </section>
                    }
                    {/*{state.diagramobject &&
                        <div className="container-fluid pt80 pb80">
                            <div className="container">
                                <form onSubmit={onSave}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">ObjectId</label>
                                        <input name="ObjectId" className="form-control"
                                               value={state.diagramobject.ObjectId}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Title</label>
                                        <input name="title" className="form-control" value={state.diagramobject.title}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Description</label>
                                        <input name="description" className="form-control"
                                               value={state.diagramobject.description} onChange={handleChange}/>
                                    </div>
                                       <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Tags</label>
                                    <input name="Tags" className="form-control" value={state.diagramobject.Tags}  onChange={handleChange} />
                                </div>
                                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">PublicDate</label>
                                    <input name="PublicDate" className="form-control" type='date' value={state.post.PublicDate}  onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">ImageSRC</label>
                                    <input name="imageSrc" className="form-control" type='text'
                                           value={state.diagramobject?.imageSrc} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">ImageSRC File Upload</label>
                                    <input name="imageSrc" className="form-control" type='file'
                                           onChange={handleUploadChange}/>
                                </div>
                                <hr/>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">JSON SRC</label>
                                    <input name="jsonSrc" className="form-control" type='text'
                                           value={state.diagramobject.jsonSrc} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">jsonSrc File Upload</label>
                                    <input name="jsonSrc" className="form-control" type='file'
                                           onChange={handleUploadChange}/>
                                </div>

                                <div className="form-group">
                                    <MDEditor
                                        value={state.post.Body}
                                        onChange={setValue}
                                    />
                                </div>
                                <MDEditor.Markdown source={state.post.Body} style={{ whiteSpace: 'pre-wrap' }} />
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>

                    </div>
                }*/}

                </div>
                <footer>
                    <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          {/*  <button
                                className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300">Cancel
                            </button>*/}
                            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3" onClick={onSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );


}

export default DiagramObjectEditPage;