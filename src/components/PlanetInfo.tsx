import { usePlanetStore } from "../store/planetStore";


export default function PlanetInfo(){

    const planet = usePlanetStore(
        state => state.selectedPlanet
    );


    const updatePlanet = usePlanetStore(
        state => state.updatePlanet
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
                  marginTop:"15px"
              }}
          >

              <p>
                  Besitzer: {planet.ownerId || "-"}
              </p>

          </div>


      </div>

  );

}