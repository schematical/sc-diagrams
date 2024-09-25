"use client";
import {Diagram, DiagramFlow} from "@/components/diagrams/util";
import Image from "next/image";
import UserImage06 from "@/public/images/user-40-06.jpg";
import EditMenu from "@/components/edit-menu";
import FeedImage01 from "@/public/images/feed-image-01.jpg";

import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';


import axios from "axios";
import {GQLService} from "@/services/GQLService";
import {useParams} from "next/navigation";
import Image01 from "@/public/images/transactions-image-01.svg";


interface DiagramListPageState {
    loaded?: boolean;
    diagramFlows?: DiagramFlow[];

    selectedDiagramFlow?: DiagramFlow;
}

export default function DiagramFlowListPage(): any {
    const params = useParams();

    const [state, setState] = useState<DiagramListPageState>({});

    const refreshData = async () => {
        if (!params.username) {

            return
        }
        const res = (await GQLService.listDiagramFlow({
            parentUri: `${params.username}/diagrams/${params.diagramId}`
        }));
        setState({
            loaded: true,
            ...state,
            diagramFlows: res.Items
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
        if (!state.selectedDiagramFlow) throw new Error("Missing `state.selectedDiagramFlow`");
        // event.preventDefault();
        const res = (await GQLService.createDiagramFlow(state.selectedDiagramFlow));
        window.location.href = `/${state.selectedDiagramFlow?.parentUri}/flows/${state.selectedDiagramFlow?._id}`;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const selectedDiagramFlow = state.selectedDiagramFlow;
        if (!selectedDiagramFlow) throw new Error("Missing  `state.selectedDiagram`");
        let value = event.target.value;
        switch (event.target.name) {
            case ('_id'):
                value = value.toLowerCase().replace(/[^a-zA-Z0-9\-]/g, '');
                break;
            case ('name'):
                selectedDiagramFlow._id = value.toLowerCase()
                    .replace(' ', '-')
                    .replace(/[^a-zA-Z0-9\-]/g, '');
                break;
        }

        (selectedDiagramFlow as any)[event.target.name] = value;
        console.log("State.selectedDiagramFlow:", state.selectedDiagramFlow);
        setState({
            ...state,
            selectedDiagramFlow
        });
    }
    const onNewDiagramClick = (event: any) => {
        event.preventDefault();
        setState({
            selectedDiagramFlow: {
                _id: 'diagram-flow-' + Math.floor(Math.random() * 99999),
                name: "My Diagram Flow " + Date.now().toString(),
                diagramId: params.diagramId,
                username: params.username as string,
                parentUri: `${params.username}/diagrams/${params.diagramId}`,

            }
        })
    }
    return (
        <div className="bg-white dark:bg-slate-900">
            <div>
                {
                    !state.selectedDiagramFlow &&
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white m-5" onClick={onNewDiagramClick}>New
                        Diagram
                        Flow</button>
                }
                {
                    state.selectedDiagramFlow &&
                    <div className="border-t border-slate-200 dark:border-slate-700 pb-5">
                        {/* Components */}
                        <div className="space-y-8 mt-8 px-5">
                            <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                                Flow
                                Detail
                            </h2>
                            <div>
                                <div>
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="selectedTileX">
                                        Name
                                    </label>
                                    <input className="form-input w-full" type="text"
                                           id="name"
                                           name="name"
                                           placeholder="Name"
                                           value={state.selectedDiagramFlow.name}
                                           onChange={handleChange}
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="selectedTileX">
                                        Id
                                    </label>
                                    <input className="form-input w-full" type="text"
                                           id="_id"
                                           name="_id"
                                           placeholder="Name"
                                           value={state.selectedDiagramFlow?._id}
                                           onChange={handleChange}
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1"
                                           htmlFor="description">
                                        Description
                                    </label>
                                    <input className="form-input w-full" type="text"
                                           id="description"
                                           name="description"
                                           placeholder="Name"
                                           value={state.selectedDiagramFlow?.description}
                                           onChange={handleChange}
                                    />

                                </div>
                            </div>
                            <button type="button" className="btn bg-indigo-500 hover:bg-indigo-600 text-white"  onClick={(e) => onSave(e) }>Save</button>
                        </div>
                    </div>


                }
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full dark:text-slate-300">
                        {/* Table header */}
                        <thead
                            className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                                <div className="flex items-center">
                                    <label className="inline-flex">
                                        <span className="sr-only">Select all</span>
                                        <input className="form-checkbox" type="checkbox"
                                               onChange={handleSelectAllChange}
                                               checked={isAllSelected}/>
                                    </label>
                                </div>
                            </th>*/}
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Name</div>
                            </th>
                            <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                <div className="font-semibold text-left">Owner</div>
                            </th>

                        </tr>
                        </thead>
                        {/* Table body */}
                        <tbody
                            className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
                        {
                            state.diagramFlows &&
                            state.diagramFlows.map((diagramFlow: DiagramFlow) => {
                                return <DiagramFlowDetailComponent diagramFlow={diagramFlow}/>
                            })
                        }
                        </tbody>
                    </table>

                </div>



            </div>
        </div>
    );


}

interface DiagramDetailComponentProps {
    diagramFlow: DiagramFlow
}

function DiagramFlowDetailComponent(props: DiagramDetailComponentProps) {
    return <tr>
        {/*<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
            <div className="flex items-center">
                <label className="inline-flex">
                    <span className="sr-only">Select</span>
                    <input className="form-checkbox" type="checkbox" onChange={handleCheckboxChange}
                           checked={isSelected}/>
                </label>
            </div>
        </td>*/}
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
            <div className="flex items-center">
                <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
                    <a href={`/${props.diagramFlow.parentUri}/flows/${props.diagramFlow._id}`}>
                        <Image className="rounded-full" src={Image01} width={36} height={36}
                               alt={props.diagramFlow.name || ""}/>
                    </a>
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-100">
                    <a href={`/${props.diagramFlow.parentUri}/flows/${props.diagramFlow._id}`}>
                        {props.diagramFlow.name}
                    </a>
                </div>
            </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="text-left">
                <div
                    className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1`}>
                    {props.diagramFlow.parentUri}
                </div>
            </div>
        </td>

    </tr>
}