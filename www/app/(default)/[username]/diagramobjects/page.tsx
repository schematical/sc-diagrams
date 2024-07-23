"use client";
import {Diagram, DiagramObject} from "@/components/diagrams/util";
import Image from "next/image";
import UserImage06 from "@/public/images/user-40-06.jpg";
import EditMenu from "@/components/edit-menu";
import FeedImage01 from "@/public/images/feed-image-01.jpg";

import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';


import axios from "axios";
import {GQLService} from "@/services/GQLService";
import {useParams} from "next/navigation";
import {getJwt} from "@/services/util";


interface DiagramObjectListPageState {
    loaded?: boolean;
    diagramObjects?: DiagramObject[];

    selectedDiagramObject?: DiagramObject;
    new?: boolean;
}

export default function DiagramObjectListPage() {
    const params = useParams();


    const [state, setState] = useState<DiagramObjectListPageState>({});

    const refreshData = async () => {
        if (!params.username) {

            return
        }
        const res: DiagramObject[] = (await GQLService.listDiagramObject({ parentUri: params.username })).Items;
        let selectedDiagramObject; // = null;
        if(params.objectId) {
            selectedDiagramObject = res.find((diagramObject) => diagramObject._id === params.objectId);
        } else if (state.new) {
            selectedDiagramObject = {
                _id: 'do-' + Math.floor(Math.random() * 99999),
                title: "My DiagramObject " + Date.now().toString(),
                // username: params.username as string,
                parentUri: params.username as string,
                imageSrc: "",
                jsonSrc: "",
                x: 0,
                y: 0
            }
        }
        setState({
            loaded: true,
            ...state,
            diagramObjects: res,
            selectedDiagramObject
        })
    }


    useEffect(() => {
        if (state.loaded) {
            return;
        }
        /*const token = localStorage.getItem('accessToken');
        if (!token) {
            document.location.href = '/login';
        }*/
        refreshData();
    });

    async function onSave(event: any) {
        if (!state.selectedDiagramObject) throw new Error("Missing `state.selectedDiagramObject`");
        event.preventDefault();
        const res = (await GQLService.createDiagramObject(state.selectedDiagramObject));
        window.location.href = `/${state.selectedDiagramObject?.parentUri}/diagramobjects/${state.selectedDiagramObject?._id}`;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagramObject = state.selectedDiagramObject;
        if (!selectedDiagramObject) throw new Error("Missing  `state.selectedDiagramObject`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('_id'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedDiagramObject._id = value.toLowerCase().replace(/[^a-zA-Z0-9\-]]/g, '');
                break;
        }

        (selectedDiagramObject as any)[event.target.name] = value;
        console.log("State.selectedDiagramObject:", state.selectedDiagramObject);
        setState({
            ...state,
            selectedDiagramObject
        });
    }
    const handleUploadChange = async (event: any) => {
        if (!state.selectedDiagramObject) throw new Error("Missing `state.selectedDiagramObject`");

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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${params.username}/diagramobjects/${state.selectedDiagramObject._id}/upload`,
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
        const selectedDiagramObject = state.selectedDiagramObject;

        (selectedDiagramObject as any) = {
            ...state.selectedDiagramObject,
            [event.target.name]: res.data.url
        }
        setState({
            ...state,
            selectedDiagramObject
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
    }
    return (
        <>
            {
                state.diagramObjects &&
                state.diagramObjects.map((diagramObject: DiagramObject) => {
                    return <DiagramObjectDetailComponent diagramObject={diagramObject} />
                })
            }

            {/*{
                    !state.selectedDiagram &&
                    <button type="button" className="btn btn-primary" onClick={onNewDiagramClick}>New Diagram</button>
                }
                {
                    state.selectedDiagram &&
                    <form onSubmit={onSave}>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input name="name" className="form-control" value={state.selectedDiagram.name}  onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Diagram Id</label>
                            <input name="_id" className="form-control" value={state.selectedDiagram?._id} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Description</label>
                            <input name="description" className="form-control" value={state.selectedDiagram.description}  onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn btn-primary" >Save</button>
                    </form>
                }*/}
        </>
    );



}
interface DiagramObjectDetailComponentProps {
    diagramObject: DiagramObject
}
function DiagramObjectDetailComponent(props: DiagramObjectDetailComponentProps) {
    return <div
        className="bg-white dark:bg-slate-800 shadow-md rounded border border-slate-200 dark:border-slate-700 p-5">
        {/* Header */}
        <header className="flex justify-between items-start space-x-3 mb-3">
            {/* User */}
            <div className="flex items-start space-x-3">
                <Image className="rounded-full shrink-0" src={UserImage06} width={40} height={40} alt="User 06"/>
                <div>
                    <div className="leading-tight">
                        <a className="text-sm font-semibold text-slate-800 dark:text-slate-100" href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
                            {props.diagramObject.title}
                        </a>
                    </div>
                    <div className="inline-flex items-center">
                        <div className="text-xs text-slate-500">
                            {props.diagramObject.parentUri}
                        </div>
                    </div>
                </div>
            </div>
            {/* Menu button */}
            <EditMenu align="right" className="shrink-0"/>
        </header>
        {/* Body */}
        <div className="text-sm text-slate-800 dark:text-slate-100 space-y-2 mb-5">
            <p>
                {props.diagramObject.description}
            </p>
            <div className="relative !my-4">
                <Image className="block w-full" src={props.diagramObject.imageSrc} width={590} height={332} alt="Feed 01"/>
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-black bg-opacity-25 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        {/*<div className="text-xs font-medium text-slate-300">togethernature.com</div>*/}
                        <a className="text-xs font-medium text-indigo-400 hover:text-indigo-300" href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
                            View -&gt;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
}