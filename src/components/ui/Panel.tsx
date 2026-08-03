import type { ReactNode, MouseEvent } from "react";
import { useState } from "react";


type Props = {

    children: ReactNode;

    title?: string;

    onClose?: () => void;

    width?: number;

    minHeight?: number;

    initialX?: number;

    initialY?: number;

};



export default function Panel({

    children,

    title,

    onClose,

    width = 350,

    minHeight = 200,

    initialX = 30,

    initialY = 100

}: Props) {



    const [position, setPosition] =
        useState({

            x: initialX,

            y: initialY

        });



    const [dragging, setDragging] =
        useState(false);



    const [dragOffset, setDragOffset] =
        useState({

            x:0,

            y:0

        });



    const startDrag = (
        event: MouseEvent<HTMLDivElement>
    )=>{


        setDragging(true);


        setDragOffset({

            x:
                event.clientX - position.x,

            y:
                event.clientY - position.y

        });


    };



    const move = (
        event: MouseEvent<HTMLDivElement>
    )=>{


        if(!dragging)
            return;


        setPosition({

            x:
                event.clientX - dragOffset.x,

            y:
                event.clientY - dragOffset.y

        });


    };



    const stopDrag = ()=>{

        setDragging(false);

    };



    return (

        <div

            onMouseMove={move}

            onMouseUp={stopDrag}

            onMouseLeave={stopDrag}

            style={{

                position:"fixed",

                left:position.x,

                top:position.y,

                background:"#102544",

                color:"white",

                width,

                minHeight,

                padding:"20px",

                borderRadius:"10px",

                boxShadow:"0 10px 30px rgba(0,0,0,0.5)"

            }}

        >


            {
                title &&

                <div

                    onMouseDown={startDrag}

                    style={{

                        height:"50px",

                        marginTop:"-20px",

                        marginLeft:"-20px",

                        marginRight:"-20px",

                        marginBottom:"10px",

                        paddingLeft:"20px",

                        paddingRight:"10px",

                        display:"flex",

                        alignItems:"center",

                        justifyContent:"space-between",

                        cursor:"move",

                        fontWeight:"bold",

                        fontSize:"20px",

                        borderBottom:
                            "1px solid #ffffff22"

                    }}

                >

                    <span>
                        {title}
                    </span>


                    {
                        onClose &&

                        <button

                            onMouseDown={(event)=>{

                                event.stopPropagation();

                            }}

                            onClick={onClose}

                            style={{

                                cursor:"pointer",

                                background:"transparent",

                                border:"none",

                                color:"white",

                                fontSize:"20px"

                            }}

                        >

                            ✕

                        </button>

                    }


                </div>
            }



            {children}


        </div>

    );

}