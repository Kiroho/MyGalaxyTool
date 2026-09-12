import { useNotificationStore } from "../store/notificationStore";


export default function Toast(){

    const notifications =
        useNotificationStore(
            state => state.notifications
        );


    if(notifications.length === 0){
        return null;
    }


    return (

        <div

            style={{

                position:"fixed",

                bottom:"20px",

                right:"20px",

                display:"flex",

                flexDirection:"column",

                gap:"8px",

                zIndex:9999,

                pointerEvents:"none"

            }}

        >

            {
                notifications.map(
                    notification => (

                        <div

                            key={
                                notification.id
                            }

                            style={{

                                minWidth:"240px",

                                maxWidth:"360px",

                                padding:"10px 14px",

                                background:"#102544",

                                border:
                                    "1px solid #ffffff33",

                                borderRadius:"6px",

                                color:"white",

                                fontSize:"14px",

                                boxShadow:
                                    "0 4px 12px #00000055"

                            }}

                        >

                            {
                                notification.message
                            }

                        </div>

                    )
                )
            }

        </div>

    );

}