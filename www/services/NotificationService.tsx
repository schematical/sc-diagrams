import Notification from "@/components/notification";
import {DefaultLayoutState} from "@/app/(diagrams)/layout";

export interface  NotificationOptions {
    header: string;
    text: string;
}
export default class NotificationService{
    private static setState: any;
    private static state: DefaultLayoutState;
    init(){

    }
    public static async  showNotification(options: NotificationOptions) {
        let newState = {
            ...NotificationService.state
        }
        newState.notifications.push({ header: options.header, text: options.text + ' ' + newState.notifications.length});
        NotificationService.setState(newState);
    }

    static init(state: any, setState: any) {
        NotificationService.state = state;
        NotificationService.setState = setState;
    }
}