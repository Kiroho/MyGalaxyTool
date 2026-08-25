import { useState } from "react";
import { UserRoundCog } from "lucide-react";
import UserMenu from "./UserMenu";

type Props = {

    onLogout: () => void;

};


export default function UserMenuButton({
    onLogout
}: Props) {


    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);


    const [
        hovered,
        setHovered
    ] = useState(false);


    return (

        <>

            <button

                onClick={(event)=>{

                    event.stopPropagation();

                    setMenuOpen(
                        previous =>
                            !previous
                    );

                }}

                onMouseEnter={() =>
                    setHovered(true)
                }

                onMouseLeave={() =>
                    setHovered(false)
                }

                style={{

                    position:"fixed",

                    top:20,

                    right:20,

                    width:44,

                    height:44,

                    border:"none",

                    background:
                        hovered
                            ? "#ffffff22"
                            : "transparent",

                    borderRadius:"50%",

                    cursor:"pointer",

                    zIndex:100,

                    color:"white",

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                    transition:
                        "background 0.2s"

                }}

            >

                <UserRoundCog

                    size={32}

                    style={{
                        transition:
                            "transform 0.2s"

                    }}

                />

            </button>


            <UserMenu

                open={
                    menuOpen
                }

                onClose={() =>
                    setMenuOpen(false)
                }

                onLogout={
                    onLogout
                }

            />

        </>

    );

}