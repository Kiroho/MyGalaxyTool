import { useState } from "react";
import Panel from "../Panel";
import { useUIStore } from "../../../store/uiStore";
import InputTabs from "./InputTabs";
import type { InputMode } from "./InputTabs";
import { usePlanetStore } from "../../../store/planetStore";
import { addressToXYZ } from "../../../utils/address";
import XYZDisplay from "./XYZDisplay";



export default function FlightTimeWindow(){
    
    const COORDINATE_TO_LY = 12;

    const flightTimeWindowOpen = useUIStore(
        state => state.flightTimeWindow.open
    );


    const closeFlightTimeWindow = useUIStore(
        state => state.closeFlightTimeWindow
    );

    const planets = usePlanetStore(
        state => state.planets
    );


    const [startMode, setStartMode] =
        useState<InputMode>("address");


    const [targetMode, setTargetMode] =
        useState<InputMode>("address");

    const [startAddress, setStartAddress] =
        useState("");

    const [targetAddress, setTargetAddress] =
        useState("");

        
    const updateAddressPoint = (
        point:"start"|"target",
        address:string
    )=>{

        //if(!isValidAddress(address))
        //    return;


        const xyz =
            addressToXYZ(address);


        if(!xyz)
            return;


        if(point === "start"){

            setStartPoint({

                x:xyz.x,
                y:xyz.y,
                z:xyz.z

            });

        }
        else{

            setTargetPoint({

                x:xyz.x,
                y:xyz.y,
                z:xyz.z

            });

        }

    };

    const [startPoint, setStartPoint] =
        useState<{

            x:number | "";
            y:number | "";
            z:number | "";

        }>({

            x:"",
            y:"",
            z:""

        });



    const [targetPoint, setTargetPoint] =
        useState<{

            x:number | "";
            y:number | "";
            z:number | "";

        }>({

            x:"",
            y:"",
            z:""

        });



    const [speed, setSpeed] =
        useState<number | "">("");



    const [distance, setDistance] =
        useState<number | null>(null);



    const [flightTime, setFlightTime] =
        useState("");



    const updatePoint = (

        point:"start"|"target",

        axis:"x"|"y"|"z",

        value:number | ""

    )=>{


        if(point === "start"){


            setStartPoint(prev=>({

                ...prev,

                [axis]:value

            }));

        }

        else{


            setTargetPoint(prev=>({

                ...prev,

                [axis]:value

            }));

        }

    };

    const selectPlanetPoint = (

        point:"start"|"target",

        planetId:string

    )=>{

        const planet =
            planets.find(
                planet => planet.id === planetId
            );


        if(!planet)
            return;


        if(point === "start"){

            setStartPoint({

                x:planet.x,

                y:planet.y,

                z:planet.z

            });

        }
        else{

            setTargetPoint({

                x:planet.x,

                y:planet.y,

                z:planet.z

            });

        }

    };

    const calculate = ()=>{


        if(

            startPoint.x === "" ||
            startPoint.y === "" ||
            startPoint.z === "" ||
            targetPoint.x === "" ||
            targetPoint.y === "" ||
            targetPoint.z === ""

        ){

            return;

        }



        const dx =
            targetPoint.x - startPoint.x;


        const dy =
            targetPoint.y - startPoint.y;


        const dz =
            targetPoint.z - startPoint.z;



        const coordinateDistance =
            Math.sqrt(

                dx * dx +
                dy * dy +
                dz * dz

            );


        const lightyearDistance =
            coordinateDistance * COORDINATE_TO_LY;


        setDistance(
            lightyearDistance
        );



        if(speed === "" || speed <= 0){

            return;

        }



        const totalSeconds =
            Math.floor(

                lightyearDistance * speed

            );



        const hours =
            Math.floor(
                totalSeconds / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;



        setFlightTime(

            `${hours
                .toString()
                .padStart(2,"0")
            }:${
                minutes
                .toString()
                .padStart(2,"0")
            }:${
                seconds
                .toString()
                .padStart(2,"0")
            }`

        );

    };


    const renderXYZInput = (

        point:"start"|"target"

    )=>{


        const values =
            point === "start"
            ?
            startPoint
            :
            targetPoint;



        return (

            <div

                style={{

                    display:"flex",

                    gap:"10px",

                    marginTop:"20px",

                    marginBottom:"40px"

                }}

            >

                {
                    (["x","y","z"] as const).map(axis=>(

                        <div

                            key={axis}

                            style={{

                                display:"flex",

                                alignItems:"center",

                                gap:"5px"

                            }}

                        >

                            <label>

                                {axis.toUpperCase()}:

                            </label>


                            <input

                                type="number"

                                placeholder={
                                    point === "start"
                                    ?
                                    "100"
                                    :
                                    "200"
                                }

                                style={{

                                    width:"80px"

                                }}

                                value={
                                    values[axis]
                                }

                                onChange={(event)=>{

                                    updatePoint(

                                        point,

                                        axis,

                                        event.target.value === ""

                                        ?

                                        ""

                                        :

                                        Number(
                                            event.target.value
                                        )

                                    );

                                }}

                            />

                        </div>

                    ))
                }

            </div>

        );

    };


    if(!flightTimeWindowOpen)

        return null;




    return (

        <Panel

            title="Flugzeitrechner"

            width={350}

            initialX={700}

            initialY={100}

            onClose={closeFlightTimeWindow}

        >


            <h4
                style={{
                    marginBottom:"5px"
                }}
            >
                Startpunkt
            </h4>


            <InputTabs
            
                value={startMode}

                onChange={setStartMode}

            />


            {
                startMode === "xyz" &&

                renderXYZInput("start")
            }


            {
                startMode === "address" &&

                <div
                    style={{
                        marginTop:"20px",
                        marginBottom:"40px"
                    }}
                >

                    <input

                        placeholder="Adresse eingeben"

                        value={startAddress}

                        onChange={(event)=>{

                        const value =
                            event.target.value;


                        setStartAddress(value);


                        updateAddressPoint(
                            "start",
                            value
                        );

                    }}

                    />


                    {
                        <XYZDisplay

                            x={startPoint.x}

                            y={startPoint.y}

                            z={startPoint.z}

                        />
                    }


                </div>

            }


            {
                startMode === "planet" &&

                <div
                    style={{
                        marginTop:"20px",
                        marginBottom:"40px"
                    }}
                >

                    <select

                        onChange={(event)=>{

                            selectPlanetPoint(
                                "start",
                                event.target.value
                            );

                        }}

                    >

                        <option value="">
                            Planet auswählen
                        </option>


                        {
                            planets.map(planet=>(

                                <option
                                    key={planet.id}
                                    value={planet.id}
                                >

                                    {planet.name}

                                </option>

                            ))
                        }


                    </select>

                    <XYZDisplay

                        x={startPoint.x}

                        y={startPoint.y}

                        z={startPoint.z}

                    />


                </div>

            }




            <h4
                style={{
                    marginBottom:"5px"
                }}
            >
                Zielpunkt
            </h4>


            <InputTabs

                value={targetMode}

                onChange={setTargetMode}

            />



            {
                targetMode === "xyz" &&

                renderXYZInput("target")
            }


            {
                targetMode === "address" &&

                <div
                    style={{
                        marginTop:"20px",
                        marginBottom:"40px"
                    }}
                >

                    <input

                        placeholder="Adresse eingeben"

                        value={targetAddress}

                        onChange={(event)=>{

                        const value =
                            event.target.value;


                        setTargetAddress(value);


                        updateAddressPoint(
                            "target",
                            value
                        );

                    }}

                    />


                    {
                        <XYZDisplay

                            x={targetPoint.x}

                            y={targetPoint.y}

                            z={targetPoint.z}

                        />
                    }


                </div>

            }



            {
                targetMode === "planet" &&

                <div
                    style={{
                        marginTop:"20px",
                        marginBottom:"40px"
                    }}
                >

                    <select

                        onChange={(event)=>{

                            selectPlanetPoint(
                                "target",
                                event.target.value
                            );

                        }}

                    >

                        <option value="">
                            Planet auswählen
                        </option>


                        {
                            planets.map(planet=>(

                                <option
                                    key={planet.id}
                                    value={planet.id}
                                >

                                    {planet.name}

                                </option>

                            ))
                        }


                    </select>


                    <XYZDisplay

                        x={targetPoint.x}

                        y={targetPoint.y}

                        z={targetPoint.z}

                    />

                </div>

            }




            <hr />



            <div

                style={{

                    display:"flex",

                    alignItems:"center",

                    gap:"10px",

                    marginTop:"15px"

                }}

            >

                <label>

                    Geschwindigkeit:

                </label>


                <input

                    style={{

                        width:"50px"

                    }}

                    type="number"

                    placeholder="1.23"

                    step="0.01"

                    value={speed}

                    onChange={(event)=>{

                        setSpeed(

                            event.target.value === ""

                            ?

                            ""

                            :

                            Number(
                                event.target.value
                            )

                        );

                    }}

                />


                <label>

                    s/lj

                </label>


                <button

                    style={{

                        marginLeft:"20px"

                    }}

                    onClick={calculate}

                >

                    Berechnen

                </button>


            </div>





            {
                distance !== null &&

                <div

                    style={{

                        marginTop:"20px"

                    }}

                >

                    <div>

                        Entfernung:

                        <strong>

                            {" "}

                            {distance.toFixed(2)}

                        </strong>
                        &nbsp;lj

                    </div>


                    <div

                        style={{

                            marginTop:"8px"

                        }}

                    >

                        Flugzeit:

                        <strong>

                            {" "}

                            {flightTime}

                        </strong>
                        {flightTime && ` h`}

                    </div>


                </div>

            }


        </Panel>

    );

}