import type { ReactNode } from "react";


type Props = {

    children: ReactNode;

    width?: number;

    minHeight?: number;

};


export default function Panel({

    children,

    width = 350,

    minHeight

}: Props) {


    return (

        <div

            style={{

                background:"#102544",

                color:"white",

                width,

                minHeight,

                padding:"20px",

                borderRadius:"10px",

                boxShadow:"0 10px 30px rgba(0,0,0,0.5)"

            }}

        >

            {children}

        </div>

    );

}