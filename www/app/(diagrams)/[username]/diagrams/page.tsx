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
import Image01 from '@/public/images/transactions-image-01.svg'
import DeleteButton from "@/components/delete-button";
import SearchForm from "@/components/search-form";
import BasicDropDown, {BasicDropDownOption} from "@/components/diagrams/BasicDropDown";


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
        <div className="bg-white dark:bg-slate-900">
            <div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">


                        {/* Right: Actions */}
                        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">



                            {/* Export button */}
                            <a href={`/${params.username}/diagrams/new`} className="btn bg-indigo-500 hover:bg-indigo-600 text-white m-5">
                                New Diagram
                            </a>

                        </div>

                    </div>

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
                            state.diagrams &&
                            state.diagrams.map((diagram: Diagram) => {
                                return <DiagramDetailComponent diagram={diagram}/>
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
    diagram: Diagram
}

function DiagramDetailComponent(props: DiagramDetailComponentProps) {
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
                    <a href={`/${props.diagram.parentUri}/diagrams/${props.diagram._id}`}>
                        <Image className="rounded-full" src={Image01} width={36} height={36}
                               alt={props.diagram.name}/>
                    </a>
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-100">
                    <a href={`/${props.diagram.parentUri}/diagrams/${props.diagram._id}`}>
                        {props.diagram.name}
                    </a>
                </div>
            </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="text-left">
                <div
                    className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1`}>
                    {props.diagram.parentUri}
                </div>
            </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
            <div className="text-left">
                <div
                    className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1`}>
                    <BasicDropDown  options={[
                        {
                            id: 0,
                            text: "Options",
                        },
                        {
                            id: 1,
                            text: "Duplicate",
                            callback: (option: BasicDropDownOption) => {

                            }
                        },
                        {
                            id: 2,
                            text: "Delete",
                            callback: (option: BasicDropDownOption) => {

                            }
                        }
                    ]}/>
                </div>
            </div>
        </td>

    </tr>;
}