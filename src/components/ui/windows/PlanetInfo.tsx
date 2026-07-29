import { useState } from "react";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import type { Planet } from "../../../types/planet";


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


    


    if(!planet)
        return null;


    // beim ersten Öffnen Kopie erstellen
    const currentPlanet =
        editPlanet ?? {
            ...planet
        };



    const changePlanet = (
        changes: Partial<Planet>
    )=>{

        const updatedPlanet = {

            ...currentPlanet,

            ...changes

        };


        setEditPlanet(updatedPlanet);

        setPreviewPlanet(updatedPlanet);

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