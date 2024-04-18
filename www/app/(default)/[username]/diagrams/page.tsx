"use client";
import {Diagram} from "@/components/diagrams/util";
import Image from "next/image";
import UserImage06 from "@/public/images/user-40-06.jpg";
import EditMenu from "@/components/edit-menu";
import FeedImage01 from "@/public/images/feed-image-01.jpg";

import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';


import axios from "axios";
import {GQLService} from "@/services/GQLService";
import {useParams} from "next/navigation";


interface DiagramListPageState {
    loaded?: boolean;
    diagrams?: Diagram[];

    selectedDiagram?: Diagram;
}

export default function DiagramListPage() {
    const params = useParams();

    const [state, setState] = useState<DiagramListPageState>({});

    const refreshData = async () => {
        if (!params.username) {

            return
        }
        const res = (await GQLService.listDiagram({
            parentUri: params.username
        }));
        setState({
            loaded: true,
            ...state,
            diagrams: res.Items
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
        if (!state.selectedDiagram) throw new Error("Missing `state.selectedDiagram`");
        event.preventDefault();
        const res = (await GQLService.createDiagram(state.selectedDiagram));
        window.location.href = `/${state.selectedDiagram?.parentUri}/diagrams/${state.selectedDiagram?._id}`;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagram = state.selectedDiagram;
        if (!selectedDiagram) throw new Error("Missing  `state.selectedDiagram`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('_id'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedDiagram._id = value.toLowerCase()
                    .replace(' ', '-')
                    .replace(/[^a-zA-Z0-9\-]/g, '');
                break;
        }

        (selectedDiagram as any)[event.target.name] = value;
        console.log("State.selectedDiagram:", state.selectedDiagram);
        setState({
            ...state,
            selectedDiagram
        });
    }
    const onNewDiagramClick = (event: any) => {
        event.preventDefault();
        setState({
            selectedDiagram: {
                _id: 'diagram-' + Math.floor(Math.random() * 99999),
                name: "My Diagram " + Date.now().toString(),
                username: params.username as string,
                parentUri: params.username as string,
                data: {
                    tiles: [],
                    resources: []
                }
            }
        })
    }
    return (
        <>
            {
                state.diagrams &&
                state.diagrams.map((diagram: Diagram) => {
                    return <DiagramDetailComponent diagram={diagram} />
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
interface DiagramDetailComponentProps {
    diagram: Diagram
}
export function DiagramDetailComponent(props: DiagramDetailComponentProps) {
    return <div
        className="bg-white dark:bg-slate-800 shadow-md rounded border border-slate-200 dark:border-slate-700 p-5">
        {/* Header */}
        <header className="flex justify-between items-start space-x-3 mb-3">
            {/* User */}
            <div className="flex items-start space-x-3">
                <Image className="rounded-full shrink-0" src={UserImage06} width={40} height={40} alt="User 06"/>
                <div>
                    <div className="leading-tight">
                        <a className="text-sm font-semibold text-slate-800 dark:text-slate-100" href="#0">
                            {props.diagram.name}
                        </a>
                    </div>
                    <div className="inline-flex items-center">
                        <div className="text-xs text-slate-500">
                            {props.diagram.parentUri}
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
                {props.diagram.description}
            </p>
            <div className="relative !my-4">
                <Image className="block w-full" src={FeedImage01} width={590} height={332} alt="Feed 01"/>
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-black bg-opacity-25 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        {/*<div className="text-xs font-medium text-slate-300">togethernature.com</div>*/}
                        <a className="text-xs font-medium text-indigo-400 hover:text-indigo-300" href={`/${props.diagram.parentUri}/diagrams/${props.diagram._id}`}>
                            View -&gt;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
}