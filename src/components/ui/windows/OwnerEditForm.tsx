import { useState } from "react";
import type { Owner } from "../../../types/owner";
import { useOwnerStore } from "../../../store/ownerStore";


type Props = {

    owner: Owner;

    onClose:()=>void;

};


export default function OwnerEditForm({
    owner,
    onClose
}:Props){


    const updateOwner = useOwnerStore(
        state=>state.updateOwner
    );


    const [name,setName] = useState(
        owner.name
    );


    const [color,setColor] = useState(
        owner.color
    );



    return (

        <div

            style={{

                marginTop:"20px",

                borderTop:"1px solid #ffffff33",

                paddingTop:"15px"

            }}

        >

            <h4

                style={{

                    marginBottom:"15px"

                }}

            >
                Besitzer bearbeiten

            </h4>



            <div

                style={{

                    display:"flex",

                    alignItems:"center",

                    marginBottom:"12px"

                }}

            >

                <label

                    style={{

                        width:"80px"

                    }}

                >

                    Name:

                </label>


                <input

                    style={{

                        flex:1,

                        padding:"5px"

                    }}

                    value={name}

                    onChange={(event)=>
                        setName(
                            event.target.value
                        )
                    }

                />

            </div>



            <div

                style={{

                    display:"flex",

                    alignItems:"center",

                    marginBottom:"20px"

                }}

            >

                <label

                    style={{

                        width:"80px"

                    }}

                >

                    Farbe:

                </label>


                <input

                    type="color"

                    value={color}

                    onChange={(event)=>
                        setColor(
                            event.target.value
                        )
                    }

                />


                <span

                    style={{

                        marginLeft:"10px"

                    }}

                >

                    {color}

                </span>


            </div>



            <div

                style={{

                    display:"flex",

                    justifyContent:"flex-end",

                    gap:"10px"

                }}

            >

                <button

                    onClick={onClose}

                >

                    Abbrechen

                </button>


                <button

                    onClick={()=>{

                        updateOwner(
                            owner.id,
                            {
                                name,
                                color
                            }
                        );


                        onClose();

                    }}

                >

                    Speichern

                </button>


            </div>


        </div>

    );

}