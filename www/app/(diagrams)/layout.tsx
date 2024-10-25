'use client';
import Sidebar from '@/components/ui/sidebar'
import Header from '@/components/ui/header'
import NotificationService, {NotificationOptions} from "@/services/NotificationService";
import {useState} from "react";

export interface DefaultLayoutState {
    notifications: NotificationOptions[]
}

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const [state, setState] = useState<DefaultLayoutState>({
        notifications: []
    });
    NotificationService.init(state, setState);
    return (
        <div className="flex h-[100dvh] overflow-hidden">

            {/* Sidebar */}
            {/*<Sidebar />*/}

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header/>

                <main className="grow [&>*:first-child]:scroll-mt-16">
                    {children}
                </main>
                <div className=" absolute bottom-0 left-0 z-50">
                    <div className="p-10">
                        {
                            state.notifications.map((options: NotificationOptions, index) => {
                                return <div role="alert pb-2" key={index}>
                                    <div
                                        className="inline-flex flex-col w-full max-w-lg px-4 py-2 rounded-sm text-sm bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                        <div className="flex w-full justify-between items-start">
                                            <div className="flex">

                                                <div>
                                                    <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                                                        {options.header}
                                                    </div>
                                                    <div>
                                                        {options.text}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="opacity-70 hover:opacity-80 ml-3 mt-[3px]"
                                                    onClick={() => {
                                                        const newState = {
                                                            ...state
                                                        }

                                                        newState.notifications.splice(index, 1);
                                                        setState(newState);
                                                    }}>
                                                <div className="sr-only">Close</div>
                                                <svg className="w-4 h-4 fill-current">
                                                    <path
                                                        d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-right mt-1">
                                            <a className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                               href="#0">Action -&gt;</a>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
