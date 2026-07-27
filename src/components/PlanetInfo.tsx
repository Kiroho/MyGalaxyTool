import { usePlanetStore } from "../store/planetStore";
import { useOwnerStore } from "../store/ownerStore";


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


    if(!planet)
        return null;


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

                  value={planet.name}

                  onChange={(event)=>{

                      updatePlanet(
                          planet.id,
                          {
                              name:event.target.value
                          }
                      );

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

                  value={planet.x}

                  onChange={(event)=>{

                      updatePlanet(
                          planet.id,
                          {
                              x:Number(event.target.value)
                          }
                      );

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

                      updatePlanet(
                          planet.id,
                          {
                              y:Number(event.target.value)
                          }
                      );

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

                      updatePlanet(
                          planet.id,
                          {
                              z:Number(event.target.value)
                          }
                      );

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

                    updatePlanet(
                        planet.id,
                        {
                            ownerId:event.target.value
                        }
                    );

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

          


      </div>

  );

}