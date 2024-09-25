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
import ShopSidebar from "@/app/(default)/ecommerce/(shop)/shop-sidebar";
import ShopCards07 from "@/app/(default)/ecommerce/(shop)/shop-cards-07";
import PaginationClassic from "@/components/pagination-classic";
import AppImage21 from "@/public/images/applications-image-21.jpg";


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
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Page header */}
            <div className="mb-5">

                {/* Title */}
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                    Diagram Objects✨
                </h1>
                <a className="btn bg-indigo-500 hover:bg-indigo-600 text-white float-right" href={`/${params.username}/diagramobjects/new`}>New Diagram Object</a>
            </div>

            {/* Page content */}
            <div
                className="flex flex-col space-y-10 sm:flex-row sm:space-x-6 sm:space-y-0 md:flex-col md:space-x-0 md:space-y-10 xl:flex-row xl:space-x-6 xl:space-y-0 mt-9">

                {/* Sidebar */}
                {/*<ShopSidebar />*/}

                {/* Content */}
                <div>

                    {/* Filters */}
                    {/*<div className="mb-5">
                        <ul className="flex flex-wrap -m-1">
                            <li className="m-1">
                                <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out">View All</button>
                            </li>
                            <li className="m-1">
                                <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Featured</button>
                            </li>
                            <li className="m-1">
                                <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Newest</button>
                            </li>
                            <li className="m-1">
                                <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Price - Low To High</button>
                            </li>
                            <li className="m-1">
                                <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">Price - High to Low</button>
                            </li>
                        </ul>
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400 italic mb-4">67.975 Items</div>*/}

                    {/* Cards 1 (Video Courses) */}
                    <div>
                        <div className="grid grid-cols-12 gap-6">
                            {
                                state.diagramObjects &&
                                state.diagramObjects.map((diagramObject: DiagramObject) => {
                                    return <DiagramObjectDetailComponent diagramObject={diagramObject} />
                                })
                            }
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                        <PaginationClassic />
                    </div>

                </div>

            </div>
        </div>
    )


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




}
interface DiagramObjectDetailComponentProps {
    diagramObject: DiagramObject
}
function DiagramObjectDetailComponent(props: DiagramObjectDetailComponentProps) {
    return <div
        className="col-span-full md:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex flex-col h-full">
            {/* Image */}
            <div className="relative">
                <a href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
                    <Image className="" src={props.diagramObject.imageSrc} width={301} height={226} alt={props.diagramObject.title}/>
                </a>
                {/* Like button */}
                {/*<button className="absolute top-0 right-0 mt-4 mr-4">
                    <div className="text-slate-100 bg-slate-900 bg-opacity-60 rounded-full">
                        <span className="sr-only">Like</span>
                        <svg className="h-8 w-8 fill-current" viewBox="0 0 32 32">
                            <path
                                d="M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z"/>
                        </svg>
                    </div>
                </button>*/}
                {/* Special Offer label */}
                {/*<div className="absolute bottom-0 right-0 mb-4 mr-4">
                    <div
                        className="inline-flex items-center text-xs font-medium text-slate-100 dark:text-slate-300 bg-slate-900/60 dark:bg-slate-800/60 rounded-full text-center px-2 py-0.5">
                        <svg className="w-3 h-3 shrink-0 fill-current text-amber-500 mr-1" viewBox="0 0 12 12">
                            <path
                                d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z"/>
                        </svg>
                        <span>Special Offer</span>
                    </div>
                </div>*/}
            </div>
            {/* Card Content */}
            <div className="grow flex flex-col p-5">
                {/* Card body */}
                <div className="grow">
                    <header className="mb-2">
                        <a href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
                            <h3 className="text-lg text-slate-800 dark:text-slate-100 font-semibold mb-1">
                                {props.diagramObject.title}
                            </h3>
                        </a>
                        <div className="text-sm">
                            {props.diagramObject.description}
                        </div>
                    </header>
                </div>
                {/* Rating and price */}
                <div className="flex flex-wrap justify-between items-center">
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mr-2">
                        {/* Stars */}
                        {/*<div className="flex space-x-1">
                            <button>
                                <span className="sr-only">1 star</span>
                                <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 16 16">
                                    <path
                                        d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"/>
                                </svg>
                            </button>
                            <button>
                                <span className="sr-only">2 stars</span>
                                <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 16 16">
                                    <path
                                        d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"/>
                                </svg>
                            </button>
                            <button>
                                <span className="sr-only">3 stars</span>
                                <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 16 16">
                                    <path
                                        d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"/>
                                </svg>
                            </button>
                            <button>
                                <span className="sr-only">4 stars</span>
                                <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 16 16">
                                    <path
                                        d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"/>
                                </svg>
                            </button>
                            <button>
                                <span className="sr-only">5 stars</span>
                                <svg className="w-4 h-4 fill-current text-slate-300 dark:text-slate-600"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"/>
                                </svg>
                            </button>
                        </div>
                         Rate
                        <div className="inline-flex text-sm font-medium text-amber-600">4.7</div>*/}
                    {/*</div>
                     Price
                    <div>
                        <div
                            className="inline-flex text-sm font-medium bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400 rounded-full text-center px-2 py-0.5">$39.00
                        </div>*/}
                    </div>
                </div>
            </div>
        </div>
    </div>

   /* return <div
        className="bg-white dark:bg-slate-800 shadow-md rounded border border-slate-200 dark:border-slate-700 p-5">
        {/!* Header *!/}
        <header className="flex justify-between items-start space-x-3 mb-3">
            {/!* User *!/}
            <div className="flex items-start space-x-3">
                <Image className="rounded-full shrink-0" src={UserImage06} width={40} height={40} alt="User 06"/>
                <div>
                    <div className="leading-tight">
                        <a className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                           href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
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
            {/!* Menu button *!/}
            <EditMenu align="right" className="shrink-0"/>
        </header>
        {/!* Body *!/}
        <div className="text-sm text-slate-800 dark:text-slate-100 space-y-2 mb-5">
            <p>
                {props.diagramObject.description}
            </p>
            <div className="relative !my-4">
                <Image className="block w-full" src={props.diagramObject.imageSrc} width={590} height={332}
                       alt="Feed 01"/>
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-black bg-opacity-25 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        {/!*<div className="text-xs font-medium text-slate-300">togethernature.com</div>*!/}
                        <a className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                           href={`/${props.diagramObject.parentUri}/diagramobjects/${props.diagramObject._id}`}>
                            View -&gt;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>*/
}