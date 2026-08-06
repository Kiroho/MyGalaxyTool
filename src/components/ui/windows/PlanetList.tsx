import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { xyzToAddress } from "../../../utils/address";
import { useUIStore } from "../../../store/uiStore";
import { useState, useEffect, useRef } from "react";
import {Trash2 } from "lucide-react";
import Panel from "../Panel";


export default function PlanetList(){


    const planets = usePlanetStore(
        state => state.planets
    );


    const selectPlanet = usePlanetStore(
        state => state.selectPlanet
    );


    const owners = useOwnerStore(
        state => state.owners
    );


    const selectedOwnerIds = useUIStore(
        state => state.selectedOwnerIds
    );


    const setSelectedOwnerIds = useUIStore(
        state => state.setSelectedOwnerIds
    );


    const initializedFilter = useRef(false);



    const [deleteConfirmId, setDeleteConfirmId] =
        useState<string | null>(null);


    const [ownerDropdownOpen, setOwnerDropdownOpen] =
        useState(false);



    const ownerDropdownRef =
        useRef<HTMLDivElement>(null);



    const deletePlanet = usePlanetStore(
        state => state.deletePlanet
    );


    const closePlanetListWindow = useUIStore(
        state => state.closePlanetListWindow
    );


    const planetListOpen = useUIStore(
        state => state.planetListWindow.open
    );



    useEffect(()=>{

        if(
            !initializedFilter.current &&
            owners.length > 0
        ){

            setSelectedOwnerIds(
                owners.map(owner => owner.id)
            );


            initializedFilter.current = true;

        }

    },[
        owners,
        setSelectedOwnerIds
    ]);




    useEffect(()=>{


        const handleClick = (event:MouseEvent)=>{


            if(

                ownerDropdownRef.current &&

                !ownerDropdownRef.current.contains(
                    event.target as Node
                )

            ){

                setOwnerDropdownOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClick
        );


        return ()=>{

            document.removeEventListener(
                "mousedown",
                handleClick
            );

        };


    },[]);



    if(!planetListOpen)
        return null;



    const filteredPlanets =
        planets.filter(planet =>
            selectedOwnerIds.includes(
                planet.owner_id
            )
        );



    return (

        <Panel

            title="Planetenliste"

            width={550}

            minHeight={200}

            initialX={30}

            initialY={100}

            onClose={closePlanetListWindow}

        >



            <div

                ref={ownerDropdownRef}

                style={{

                    position:"relative",

                    marginBottom:"15px"

                }}

            >


                <button

                    onClick={()=>{

                        setOwnerDropdownOpen(
                            prev => !prev
                        );

                    }}

                    style={{

                        width:"150px",

                        padding:"5px",

                        cursor:"pointer"

                    }}

                >

                    Besitzer auswählen ▼

                </button>



                {
                    ownerDropdownOpen &&

                    <div

                        style={{

                            position:"absolute",

                            top:"100%",

                            left:0,

                            width:"220px",

                            background:"#102544",

                            border:"1px solid #ffffff33",

                            padding:"8px",

                            zIndex:10

                        }}

                    >


                        <div

                            style={{

                                display:"flex",

                                gap:"6px",

                                marginBottom:"8px",

                                paddingBottom:"8px",

                                borderBottom:
                                    "1px solid #ffffff33"

                            }}

                        >

                            <button

                                onClick={()=>{

                                    setSelectedOwnerIds(
                                        owners.map(
                                            owner=>owner.id
                                        )
                                    );

                                }}

                            >

                                Alle auswählen

                            </button>


                            <button

                                onClick={()=>{

                                    setSelectedOwnerIds([]);

                                }}

                            >

                                Alles abwählen

                            </button>


                        </div>



                        {
                            owners.map(owner=>(

                                <label

                                    key={owner.id}

                                    style={{

                                        display:"flex",

                                        alignItems:"center",

                                        gap:"6px",

                                        marginBottom:"4px"

                                    }}

                                >

                                    <input

                                        type="checkbox"

                                        checked={
                                            selectedOwnerIds.includes(
                                                owner.id
                                            )
                                        }

                                        onChange={()=>{

                                            setSelectedOwnerIds(prev =>

                                                prev.includes(owner.id)

                                                ?

                                                prev.filter(
                                                    id =>
                                                    id !== owner.id
                                                )

                                                :

                                                [
                                                    ...prev,
                                                    owner.id
                                                ]

                                            );

                                        }}

                                    />


                                    <span

                                        style={{

                                            width:"12px",

                                            height:"12px",

                                            borderRadius:"50%",

                                            background:owner.color

                                        }}

                                    />


                                    {owner.name}


                                </label>

                            ))
                        }


                    </div>

                }


            </div>



            <div

                style={{

                    maxHeight:"70vh",

                    overflowY:"auto"

                }}

            >


                {
                    filteredPlanets.length === 0 &&

                    <div>

                        Keine Planeten gefunden

                    </div>

                }



                {
                    filteredPlanets.map((planet)=>(

                        <div

                            key={planet.id}

                            style={{

                                marginBottom:"10px",

                                borderBottom:
                                    "1px solid #ffffff22",

                                paddingBottom:"8px"

                            }}

                        >


                            <div

                                onClick={()=>{

                                    selectPlanet(planet);

                                }}

                                style={{

                                    display:"flex",

                                    alignItems:"center",

                                    cursor:"pointer"

                                }}

                            >


                                {

                                    (()=>{

                                        const owner =
                                            owners.find(
                                                owner =>
                                                owner.id === planet.owner_id
                                            );


                                        return (

                                            <>

                                                <span

                                                    style={{

                                                        width:"14px",

                                                        height:"14px",

                                                        borderRadius:"50%",

                                                        background:
                                                            owner?.color ?? "white",

                                                        marginRight:"8px"

                                                    }}

                                                />


                                                <span

                                                    style={{

                                                        width:"100px"

                                                    }}

                                                >

                                                    {
                                                        owner?.name ??
                                                        "Unbekannt"
                                                    }

                                                </span>


                                            </>

                                        );

                                    })()

                                }



                                <span

                                    style={{

                                        flex:1

                                    }}

                                >

                                    {planet.name}

                                </span>



                                <span

                                    style={{

                                        width:"140px"

                                    }}

                                >

                                    {
                                        xyzToAddress(
                                            planet.x,
                                            planet.y,
                                            planet.z
                                        )
                                    }

                                </span>



                                <span

                                    style={{

                                        width:"120px"

                                    }}

                                >

                                    {planet.x} / {planet.y} / {planet.z}

                                </span>



                                <button

                                    onClick={(event)=>{

                                        event.stopPropagation();

                                        setDeleteConfirmId(
                                            planet.id
                                        );

                                    }}

                                >

                                    
                                    <Trash2 size={16} />

                                </button>


                            </div>



                            {
                                deleteConfirmId === planet.id &&

                                <div

                                    style={{

                                        marginTop:"8px",

                                        display:"flex",

                                        gap:"8px",

                                        justifyContent:"flex-end"

                                    }}

                                >

                                    <span style={{
                                        marginRight:"auto"
                                    }}>

                                        Sicher löschen?

                                    </span>


                                    <button

                                        onClick={()=>{

                                            deletePlanet(
                                                planet.id
                                            );

                                            setDeleteConfirmId(null);

                                        }}

                                    >

                                        Löschen

                                    </button>


                                    <button

                                        onClick={()=>{

                                            setDeleteConfirmId(null);

                                        }}

                                    >

                                        Abbrechen

                                    </button>


                                </div>

                            }


                        </div>

                    ))
                }


            </div>


        </Panel>

    );

}