import {useFlyoutContext} from "@/app/flyout-context";


export default function DiagramSidebarComponent({
                children,
            }: {
    children: React.ReactNode,
}) {


    return (
  /*      <div
            id="messages-sidebar"
            className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
                flyoutOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >*/
            <div className="fixed z-20 flex top-16 bg-white dark:bg-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 dark:border-slate-700 md:w-[18rem] xl:w-[20rem] h-[calc(100dvh-64px)]">
                {children}
            </div>
        /*</div>*/
    )
}