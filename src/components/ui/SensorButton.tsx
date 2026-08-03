import { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { Globe } from "lucide-react";


export default function SensorButton(){

    const showSensors = useUIStore(
        state => state.showSensors
    );

    const toggleSensors = useUIStore(
        state => state.toggleSensors
    );

    const [hovered, setHovered] = useState(false);

    return (

        <button

            onClick={toggleSensors}

            onMouseEnter={() => setHovered(true)}

            onMouseLeave={() => setHovered(false)}

            style={{

                position: "fixed",

                top: 20,

                left: 70,

                width: 44,

                height: 44,

                border: "none",

                background: hovered
                    ? "#ffffff22"
                    : "transparent",

                borderRadius: "50%",

                cursor: "pointer",

                zIndex: 100,

                color: showSensors
                    ? "cyan"
                    : "white",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                transition: "background 0.2s"

            }}

        >

            <Globe size={32}/>

        </button>

    );

}