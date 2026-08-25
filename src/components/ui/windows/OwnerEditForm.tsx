import { useState } from "react";
import { type Owner, type Volk, volkList } from "../../../types/owner";
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


    const [volk,setVolk] = useState<Volk>(
        owner.volk
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
                    alignItems:"center",
                    marginBottom:"20px"
                }}
            >

                <label
                    style={{
                        width:"80px"
                    }}
                >

                    Volk:

                </label>


                <select

                    style={{
                        flex:1,
                        padding:"5px"
                    }}

                    value={volk}

                    onChange={(event) => {

                        setVolk(
                            event.target.value as Volk
                        );

                    }}

                >

                    {
                        volkList.map(
                            volk => (

                                <option
                                    key={volk}
                                    value={volk}
                                >
                                    {volk}
                                </option>

                            )
                        )
                    }

                </select>

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
                                color,
                                volk
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