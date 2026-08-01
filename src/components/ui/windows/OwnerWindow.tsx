import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import OwnerEditForm from "./OwnerEditForm";
import OwnerCreateForm from "./OwnerCreateForm";
import { useState } from "react";
import Panel from "../Panel";
import {Plus, Pencil, Trash2 } from "lucide-react";


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


    const deleteOwner = useOwnerStore(
        state => state.deleteOwner
    );



    const [editingOwnerId, setEditingOwnerId] =
        useState<string | null>(null);


    const [createMode, setCreateMode] =
        useState(false);


    const [deleteConfirmId, setDeleteConfirmId] =
        useState<string | null>(null);



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

                        alignItems:"flex-start"

                    }}

                >

                    <div>

                        <h3>

                            Besitzerverwaltung

                        </h3>


                        <button

                            onClick={()=>{

                                setCreateMode(true);

                                setEditingOwnerId(null);

                            }}

                            style={{

                                cursor:"pointer",

                                display:"flex",

                                alignItems:"center",

                                justifyContent:"center"

                            }}

                        >

                            <Plus size={18} />

                        </button>


                    </div>


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

                                    marginBottom:"10px",

                                    flexWrap:"wrap"

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


                                <div

                                    style={{

                                        display:"flex",

                                        gap:"5px"

                                    }}

                                >

                                    <button

                                        onClick={()=>{

                                            setEditingOwnerId(owner.id);

                                            setCreateMode(false);

                                            setDeleteConfirmId(null);

                                        }}

                                        style={{

                                            display:"flex",

                                            alignItems:"center",

                                            justifyContent:"center"

                                        }}

                                    >

                                        <Pencil size={16} />

                                    </button>


                                    <button

                                        onClick={()=>{

                                            setDeleteConfirmId(owner.id);

                                            setEditingOwnerId(null);

                                            setCreateMode(false);

                                        }}

                                        style={{

                                            display:"flex",

                                            alignItems:"center",

                                            justifyContent:"center"

                                        }}

                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>



                                {
                                    deleteConfirmId === owner.id
                                    &&
                                    <div

                                        style={{

                                            width:"100%",

                                            marginTop:"8px",

                                            display:"flex",

                                            justifyContent:"flex-end",

                                            gap:"8px"

                                        }}

                                    >

                                        <span

                                            style={{

                                                marginRight:"auto",

                                                fontSize:"14px"

                                            }}

                                        >

                                            Sicher löschen?

                                        </span>


                                        <button

                                            onClick={()=>{

                                                deleteOwner(
                                                    owner.id
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




                {
                    createMode && (

                        <OwnerCreateForm

                            onClose={()=>{

                                setCreateMode(false);

                            }}

                        />

                    )
                }





                {
                    editingOwnerId && (

                        <OwnerEditForm

                            key={editingOwnerId}

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