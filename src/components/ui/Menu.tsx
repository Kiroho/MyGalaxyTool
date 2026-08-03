import { useEffect } from "react";
import { useUIStore } from "../../store/uiStore";


export default function Menu() {

    const menuOpen = useUIStore(
        state => state.menuOpen
    );


    const openOwnerWindow = useUIStore(
        state => state.openOwnerWindow
    );


    const openCreatePlanetWindow = useUIStore(
        state => state.openCreatePlanetWindow
    );

    const openPlanetListWindow = useUIStore(
        state => state.openPlanetListWindow
    );


    const closeMenu = useUIStore(
        state => state.closeMenu
    );


    useEffect(()=>{

        if(!menuOpen)
            return;


        const handleClick = () => {

            closeMenu();

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
        menuOpen,
        closeMenu
    ]);



    if(!menuOpen)
        return null;



    return (

        <div

            onClick={(event)=>{

                event.stopPropagation();

            }}

            style={{

                position:"fixed",

                top:70,

                left:20,

                zIndex:100,

                background:"#102544",

                color:"white",

                width:"220px",

                padding:"10px",

                borderRadius:"8px",

                boxShadow:"0 5px 20px rgba(0,0,0,0.4)"

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

                    openCreatePlanetWindow();

                    closeMenu();

                }}

            >

                🌍 Planet hinzufügen

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

                    openPlanetListWindow();

                    closeMenu();

                }}

            >

                🪐 Planetenliste

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

                    openOwnerWindow();

                    closeMenu();

                }}

            >

                👥 Besitzerverwaltung

            </button>


        </div>

    );

}