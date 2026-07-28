import { useState } from "react";
import { Settings } from "lucide-react";
import { useUIStore } from "../../store/uiStore";


export default function MenuButton() {

    const toggleMenu = useUIStore(
        state => state.toggleMenu
    );


    const [hovered, setHovered] = useState(false);


    return (

        <button

            onClick={(event)=>{

                event.stopPropagation();

                toggleMenu();

            }}

            onMouseEnter={() => setHovered(true)}

            onMouseLeave={() => setHovered(false)}

            style={{

                position: "fixed",

                top: 20,

                left: 20,

                width: 44,

                height: 44,

                border: "none",

                background: hovered
                    ? "#ffffff22"
                    : "transparent",

                borderRadius: "50%",

                cursor: "pointer",

                zIndex: 100,

                color: "white",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                transition: "background 0.2s"

            }}

        >

            <Settings size={32} 
                style={{
                    transform: hovered
                        ? "rotate(45deg)"
                        : "rotate(0deg)",

                    transition:"transform 0.2s"
                }}
            />

        </button>

    );

}