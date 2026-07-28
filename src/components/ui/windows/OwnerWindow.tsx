import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import  OwnerEditForm  from "./OwnerEditForm";
import { useState } from "react";
import Panel from "../Panel";


export default function OwnerWindow() {


    const ownerWindowOpen = useUIStore(
        state => state.ownerWindow.open
    );


    const closeOwnerWindow = useUIStore(
        state => state.closeOwnerWindow
    );

    const owners = useOwnerStore(
        state => state.owners
    );

    const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);
/*
    const updateOwner = useOwnerStore(
        state => state.updateOwner
    );  
*/



    if(!ownerWindowOpen)
        return null;



    return (

        <div

            onClick={(event)=>{

                event.stopPropagation();

            }}

            style={{

                position:"fixed",

                top:100,

                left:30,


            }}

        >
            <Panel
                width={350}
                minHeight={200}
            >


                <div

                    style={{

                        display:"flex",

                        justifyContent:"space-between",

                        alignItems:"center"

                    }}

                >

                    <h3>
                        Besitzerverwaltung
                    </h3>


                    <button

                        onClick={closeOwnerWindow}

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


                </div>


                <hr />


                <div>

                    {
                        owners.map((owner)=>(

                            <div

                                key={owner.id}

                                style={{

                                    display:"flex",

                                    alignItems:"center",

                                    marginBottom:"10px"

                                }}

                            >

                                <div

                                    style={{

                                        width:"20px",

                                        height:"20px",

                                        background:owner.color,

                                        borderRadius:"50%",

                                        marginRight:"10px"

                                    }}

                                />

                                <span
                                    style={{
                                        flex:1
                                    }}
                                >
                                    {owner.name}
                                </span>


                                <button

                                    onClick={()=>{

                                        setEditingOwnerId(owner.id);

                                    }}

                                >

                                    ✏

                                </button>


                            </div>

                        ))
                    }

                </div>


                {
                    editingOwnerId && (

                        <OwnerEditForm

                            owner={
                                owners.find(
                                    owner =>
                                    owner.id === editingOwnerId
                                )!
                            }

                            onClose={()=>{

                                setEditingOwnerId(null);

                            }}

                        />

                    )
                }
            </Panel>


        </div>

    );

}