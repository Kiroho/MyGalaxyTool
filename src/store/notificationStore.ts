import { create } from "zustand";


export type NotificationType =
    | "success"
    | "info"
    | "warning"
    | "error";


export type Notification = {

    id: number;

    message: string;

    type: NotificationType;

};


type NotificationStore = {

    notifications: Notification[];

    addNotification: (
        message: string,
        type?: NotificationType
    ) => void;

    removeNotification: (
        id: number
    ) => void;

};


let notificationId = 0;


export const useNotificationStore =
    create<NotificationStore>((set) => ({

        notifications: [],


        addNotification: (
            message,
            type = "info"
        ) => {

            const id =
                ++notificationId;


            set(state => ({

                notifications: [
                    ...state.notifications,
                    {
                        id,
                        message,
                        type
                    }
                ]

            }));


            window.setTimeout(
                () => {

                    set(state => ({

                        notifications:
                            state.notifications.filter(
                                notification =>
                                    notification.id !== id
                            )

                    }));

                },
                3000
            );

        },


        removeNotification: (
            id
        ) => {

            set(state => ({

                notifications:
                    state.notifications.filter(
                        notification =>
                            notification.id !== id
                    )

            }));

        }

    }));