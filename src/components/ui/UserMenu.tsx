import { useEffect } from "react";
import { logout } from "../../utils/auth";
import { useUIStore } from "../../store/uiStore";

type Props = {

    open: boolean;

    onClose: () => void;

    onLogout: () => void;

};


export default function UserMenu({
    open,
    onClose,
    onLogout
}: Props) {

    const openUserSettingsWindow =
        useUIStore(
            state =>
                state.openUserSettingsWindow
        );


    useEffect(()=>{

        if(!open)
            return;


        const handleClick = () => {

            onClose();

        };


        window.addEventListener(
            "click",
            handleClick
        );


        return () => {

            window.removeEventListener(
                "click",
                handleClick
            );

        };


    },[
        open,
        onClose
    ]);


    if(!open)
        return null;


    return (

        <div

            onClick={(event)=>{

                event.stopPropagation();

            }}

            style={{

                position:"fixed",

                top:70,

                right:20,

                zIndex:10000,

                background:"#102544",

                color:"white",

                width:"180px",

                padding:"10px",

                borderRadius:"8px",

                boxShadow:
                    "0 5px 20px rgba(0,0,0,0.4)"

            }}

        >

            <button

                style={{

                    width:"100%",

                    padding:"10px",

                    cursor:"pointer",

                    background:"transparent",

                    color:"white",

                    border:"none",

                    textAlign:"left"

                }}

                onClick={()=>{

                    openUserSettingsWindow();
                    onClose();

                }}

            >

                ⚙ Kontoeinstellungen

            </button>


            <button

                style={{

                    width:"100%",

                    padding:"10px",

                    cursor:"pointer",

                    background:"transparent",

                    color:"white",

                    border:"none",

                    textAlign:"left"

                }}

                onClick={()=>{

                    logout();
                    
                    onLogout();

                    onClose();

                }}

            >

                🚪 Ausloggen

            </button>

        </div>

    );

}