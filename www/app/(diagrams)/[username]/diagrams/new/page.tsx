"use client";
import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';

import axios from "axios";
import {useParams} from "next/navigation";
import {getJwt} from "@/services/util";
import {Diagram, DiagramObject} from "@/components/diagrams/util";
import {GQLService} from "@/services/GQLService";
import {updateDiagramObject} from "@/services/graphql";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

interface DiagramEditPageState {
    loaded?: boolean;
    diagram?: Partial<Diagram>
}
interface DiagramEditPageParams extends Params {
    username: string
}

const DiagramEditPage = () => {
    const params = useParams<DiagramEditPageParams>();

    const [state, setState] = useState<DiagramEditPageState>({

    });

    const refreshData = async () => {
        if (!params.objectId) {
            setState({
                loaded: true,
                // ...state,
                diagram: {
                    parentUri: params.username,
                    username: params.username
                }
            })
            return
        }

        const res: Diagram = (await GQLService.getDiagramById({
            parentUri: params.username,
            _id: params.objectId
        }));
        setState({
            loaded: true,
            // ...state,
            diagram: res
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
        const diagram: any = state.diagram;
        diagram[event.target.name] = event.target.value;
        console.log("State.diagram:", state.diagram);
        setState({
            ...state,
            diagram
        });
    }
    const onSave = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!state.diagram) throw new Error("Missing `state.diagram`");
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

        const res: DiagramObject = (await GQLService.createDiagram({
            _id: state.diagram._id,
            name: state.diagram.name,
            parentUri: state.diagram.parentUri,
            description: state.diagram.description,
        }));

        setState({
            loaded: true,
            // ...state,
            diagram: res
        });
        document.location.href = `/${params.username}/diagrams/${res._id}`;
    }
   /* const handleUploadChange = async (event: any) => {
        event.preventDefault();

        const token = await getJwt();
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
            case('imageSrc'):
                key = files[0].name.substr(0, files[0].name.length - (extension.length + 1))
                break;
        }
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.diagram.objectId}/upload`,
            {
                extension,
                key
            },
            {
                headers: {
                    Authorization: token
                }
            }
        );
        const signedUrl = res.data.signedUrl;
        const result = await fetch(signedUrl, {
            method: "PUT",
            body: dataURItoBlob(reader.result as string),
        });

        setState({
            ...state,
            diagramobject: {
                ...state.diagramobject,
                [event.target.name]: res.data.url
            }
        });
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

    }*/

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
                    {state.diagram &&
                        <section>
                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">Diagram</h2>
                            {/*<div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia
                                deserunt mollit.
                            </div>*/}
                            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">Id</label>
                                    <input id="_id" className="form-input w-full" name="_id"
                                           value={state.diagram._id}
                                           onChange={handleChange} type='text'/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="business-id">Name</label>
                                    <input id='name' name="name" className="form-input w-full"
                                           value={state.diagram.name}
                                           onChange={handleChange} type='text'/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="location">Description</label>
                                    <input id="description" name="description"
                                           value={state.diagram.description} onChange={handleChange}
                                           className="form-input w-full" type="text"/>
                                </div>
                            </div>
                            {/*<div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">ImageSRC</label>
                                    <input id="imageSrc" className="form-input w-full" name="imageSrc" type='text'
                                           value={state.diagramobject?.imageSrc} onChange={handleChange}/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="imageSrcFile">ImageSRC
                                        File
                                        Upload</label>
                                    <input name="imageSrcFile" className="form-control" type='file'
                                           onChange={handleUploadChange}/>
                                </div>

                            </div>
                            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="jsonSrc">JSON SRC</label>
                                    <input id="jsonSrc" className="form-input w-full" name="jsonSrc" type='text'
                                           value={state.diagramobject.jsonSrc} onChange={handleChange}/>
                                </div>
                                <div className="sm:w-1/3">
                                    <label className="block text-sm font-medium mb-1" htmlFor="jsonSrcFile">jsonSrc File
                                        Upload</label>
                                    <input id="jsonSrcFile" className="form-input w-full" name="jsonSrcFile" type='file'
                                           onChange={handleUploadChange}/>
                                </div>

                            </div>*/}
                        </section>
                    }


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

export default DiagramEditPage;