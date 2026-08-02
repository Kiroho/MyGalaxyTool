import { useState } from "react";
import { useUIStore } from "../../../store/uiStore";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import type { Planet } from "../../../types/planet";
import { xyzToAddress, addressToXYZ, isValidAddress } from "../../../utils/address";
import Panel from "../Panel";


export default function CreatePlanet(){


    const openCreatePlanetWindow = useUIStore(
        state => state.createPlanetWindow.open
    );


    const closeCreatePlanetWindow = useUIStore(
        state => state.closeCreatePlanetWindow
    );


    const owners = useOwnerStore(
        state => state.owners
    );


    const addPlanet = usePlanetStore(
        state => state.addPlanet
    );


    const createEmptyPlanet = (): Planet => ({

        id: crypto.randomUUID(),

        name:"",

        x:1,

        y:1,

        z:1,

        ownerId: owners[0]?.id ?? ""

    });



    const [planet, setPlanet] =
        useState<Planet>(
            createEmptyPlanet
        );


    const [addressInput, setAddressInput] =
        useState<string | null>(null);


    const [addressMessage, setAddressMessage] =
        useState("");



    const resetPlanet = () => {

        const newPlanet =
            createEmptyPlanet();


        setPlanet(newPlanet);

        setAddressInput(null);

        setAddressMessage("");

    };



    const changePlanet = (
        changes: Partial<Planet>,
        updateAddress = true
    )=>{

        const updatedPlanet = {

            ...planet,

            ...changes

        };


        setPlanet(updatedPlanet);



        if(updateAddress){

            const newAddress =
                xyzToAddress(
                    updatedPlanet.x,
                    updatedPlanet.y,
                    updatedPlanet.z
                );


            setAddressInput(newAddress);


            if(isValidAddress(newAddress)){

                setAddressMessage(
                    "Adresse gültig"
                );

            }
            else{

                setAddressMessage(
                    "Ungültige Adresse"
                );

            }

        }

    };



    const checkAddress = (
        address: string,
        applyCoordinates = true
    )=>{

        const result = addressToXYZ(address);


        if(!result){

            setAddressMessage(
                "Ungültige Adresse"
            );

            return;

        }


        if(applyCoordinates){

            setPlanet(prev => ({

                ...prev,

                x: result.x,

                y: result.y,

                z: result.z

            }));

        }


        if(isValidAddress(address)){

            setAddressMessage(
                "Adresse gültig"
            );

        }
        else{

            setAddressMessage(
                "Ungültige Adresse"
            );

        }

    };



    if(!openCreatePlanetWindow)
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
            width={230}
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
                    Planet Erstellen
                </h3>


                <button

                    onClick={() => {

                        resetPlanet();

                        closeCreatePlanetWindow();

                    }}

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

                  value={planet.name}

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
                            planet.x,
                            planet.y,
                            planet.z
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
                                planet.x,
                                planet.y,
                                planet.z
                            );


                        checkAddress(
                            currentAddress
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

                  value={planet.x}

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

                  value={planet.y}

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

                  value={planet.z}

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

                  value={planet.ownerId}

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

                    resetPlanet();

                    closeCreatePlanetWindow();

                  }}

              >

                  Abbrechen

              </button>



              <button

                  onClick={()=>{

                    addPlanet(planet);
                    closeCreatePlanetWindow();
                    resetPlanet();

                  }}

              >

                  Speichern

              </button>


          </div>
        </Panel>

      </div>

  );

}