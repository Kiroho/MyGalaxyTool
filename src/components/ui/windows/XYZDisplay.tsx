type Props = {

    x:number | "";

    y:number | "";

    z:number | "";

};


export default function XYZDisplay({

    x,

    y,

    z

}:Props){


    return (

        <div

            style={{

                display:"flex",

                gap:"12px",

                marginTop:"10px"

            }}

        >

            <span>
                X: {x === "" ? "-" : x}
            </span>


            <span>
                Y: {y === "" ? "-" : y}
            </span>


            <span>
                Z: {z === "" ? "-" : z}
            </span>


        </div>

    );

}