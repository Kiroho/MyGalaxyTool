import { useState } from "react";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import type { Planet } from "../../../types/planet";
import { xyzToAddress,addressToXYZ, isValidAddress } from "../../../utils/address";


export default function PlanetInfo(){

    const planet = usePlanetStore(
        state => state.selectedPlanet
    );

    const updatePlanet = usePlanetStore(
        state => state.updatePlanet
    );

    const owners = useOwnerStore(
        state => state.owners
    );


    const [editPlanet, setEditPlanet] =
        useState<Planet | null>(null);


    const setPreviewPlanet = usePlanetStore(
        state => state.setPreviewPlanet
    );

    const [addressInput, setAddressInput] = useState<string | null>(null);

    const [addressMessage, setAddressMessage] = useState("");

    


    if(!planet)
        return null;


    // beim ersten Öffnen Kopie erstellen
    const currentPlanet =
        editPlanet ?? {
            ...planet
        };


    const changePlanet = (
        changes: Partial<Planet>,
        updateAddress = true
    )=>{

        const updatedPlanet = {

            ...currentPlanet,

            ...changes

        };


        setEditPlanet(updatedPlanet);

        setPreviewPlanet(updatedPlanet);


        if(updateAddress){

            const newAddress = xyzToAddress(
                updatedPlanet.x,
                updatedPlanet.y,
                updatedPlanet.z
            );


            setAddressInput(newAddress);


            if(isValidAddress(newAddress)){

                setAddressMessage("Adresse gültig");

            }
            else{

                setAddressMessage(
                    "Ungültige Adresse"
                );

            }

        }

    };



    return (

      <div

          style={{

              position:"fixed",

              top:20,

              right:20,

              zIndex:100,

              background:"#102544",

              color:"white",

              padding:"15px",

              width:"230px",

              borderRadius:"8px"

          }}

      >

          <h3>
              Planet bearbeiten
          </h3>



          <div
              style={{
                  display:"flex",
                  alignItems:"center",
                  marginBottom:"8px"
              }}
          >

              <label
                  style={{
                      width:"60px"
                  }}
              >
                  Name:
              </label>


              <input

                  style={{
                      flex:1
                  }}

                  value={currentPlanet.name}

                  onChange={(event)=>{

                      changePlanet({

                          name:event.target.value

                      });

                  }}

              />

          </div>


            


            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px"
                }}
            >

                <label
                    style={{
                        width: "60px"
                    }}
                >
                    Adresse:
                </label>


                <input

                    style={{
                        width:"110px"
                    }}

                    value={
                        addressInput ??
                        xyzToAddress(
                            currentPlanet.x,
                            currentPlanet.y,
                            currentPlanet.z
                        )
                    }

                    onChange={(event)=>{

                        setAddressInput(
                            event.target.value
                        );

                        setAddressMessage("Ungeprüft");

                    }}

                />

                <button

                    style={{

                        marginLeft:"4px",

                        padding:"3px 3px"

                    }}

                    onClick={()=>{

                        const currentAddress =
                            addressInput ??
                            xyzToAddress(
                                currentPlanet.x,
                                currentPlanet.y,
                                currentPlanet.z
                            );


                        if(!isValidAddress(currentAddress)){

                            setAddressMessage(
                                "Ungültige Adresse"
                            );

                            return;

                        }


                        const result =
                            addressToXYZ(
                                currentAddress
                            );


                        if(!result){

                            setAddressMessage(
                                "Ungültige Adresse"
                            );

                            return;

                        }


                        changePlanet({

                            x:result.x,
                            y:result.y,
                            z:result.z

                        }, false);


                        setAddressMessage(
                            "Adresse gültig"
                        );

                    }}

                >
                    Prüfen
                </button>

            </div>


            <div

                style={{

                    height:"20px",

                    marginBottom:"10px",

                    fontSize:"14px",

                color:
                    addressMessage === "Ungültige Adresse"
                    ? "#ff8080"
                    : addressMessage === "Adresse gültig"
                    ? "#80ff80"
                    : "#ffaa40"

                }}

            >

                {
                    addressMessage
                        ? addressMessage
                        : "Ungeprüft"
                }

            </div>

            


          <div
              style={{
                  display:"flex",
                  alignItems:"center",
                  marginBottom:"8px"
              }}
          >

              <label
                  style={{
                      width:"60px"
                  }}
              >
                  X:
              </label>


              <input

                  style={{
                      flex:1
                  }}

                  type="number"

                  value={currentPlanet.x}

                  onChange={(event)=>{

                      changePlanet({

                          x:Number(event.target.value)

                      });

                  }}

              />

          </div>




          <div
              style={{
                  display:"flex",
                  alignItems:"center",
                  marginBottom:"8px"
              }}
          >

              <label
                  style={{
                      width:"60px"
                  }}
              >
                  Y:
              </label>


              <input

                  style={{
                      flex:1
                  }}

                  type="number"

                  value={currentPlanet.y}

                  onChange={(event)=>{

                      changePlanet({

                          y:Number(event.target.value)

                      });

                  }}

              />

          </div>




          <div
              style={{
                  display:"flex",
                  alignItems:"center",
                  marginBottom:"8px"
              }}
          >

              <label
                  style={{
                      width:"60px"
                  }}
              >
                  Z:
              </label>


              <input

                  style={{
                      flex:1
                  }}

                  type="number"

                  value={currentPlanet.z}

                  onChange={(event)=>{

                      changePlanet({

                          z:Number(event.target.value)

                      });

                  }}

              />

          </div>




          <div
              style={{
                  display:"flex",
                  alignItems:"center",
                  marginBottom:"8px"
              }}
          >

              <label
                  style={{
                      width:"60px"
                  }}
              >
                  Besitzer:
              </label>


              <select

                  style={{
                      flex:1
                  }}

                  value={currentPlanet.ownerId}

                  onChange={(event)=>{

                      changePlanet({

                          ownerId:event.target.value

                      });

                  }}

              >

                  {
                      owners.map((owner)=>(

                          <option

                              key={owner.id}

                              value={owner.id}

                          >

                              {owner.name}

                          </option>

                      ))
                  }

              </select>

          </div>



          <div

              style={{

                  display:"flex",

                  justifyContent:"flex-end",

                  gap:"10px",

                  marginTop:"15px"

              }}

          >

              <button

                  onClick={()=>{

                      setEditPlanet(null);
                      setPreviewPlanet(null);

                  }}

              >

                  Abbrechen

              </button>



              <button

                  onClick={()=>{

                      updatePlanet(

                          currentPlanet.id,

                          currentPlanet

                      );

                      setPreviewPlanet(null);
                      setEditPlanet(null);

                  }}

              >

                  Speichern

              </button>


          </div>


      </div>

  );

}