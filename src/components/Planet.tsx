import { Billboard, Text } from "@react-three/drei";
import type { Planet as PlanetType } from "../types/planet";
import { usePlanetStore } from "../store/planetStore";
import { useOwnerStore } from "../store/ownerStore";


type Props = {
  planet: PlanetType;
};


export default function Planet({ planet }: Props) {

    const selectPlanet = usePlanetStore(
    state => state.selectPlanet
    );
  
    const selectedPlanet = usePlanetStore(
    state => state.selectedPlanet
    );

    const owners = useOwnerStore(
    state => state.owners
    );

    const owner = owners.find(
    owner => owner.id === planet.owner_id
    );

    const previewPlanet = usePlanetStore(
        state => state.previewPlanet
    );  

    const displayPlanet =
      previewPlanet?.id === planet.id
          ? previewPlanet
          : planet;


  return (
    <>

      <mesh
        position={[
          displayPlanet.x,
          displayPlanet.z,
          displayPlanet.y
        ]}
        
        onClick={(event)=>{

            event.stopPropagation();

            selectPlanet(planet);

        }}
      >

        <sphereGeometry
          args={[15]}
        />

        <meshStandardMaterial
            color={
                selectedPlanet?.id === planet.id
                    ? "yellow"
                    : owner?.color ?? "white"
            }
            transparent
            opacity={0.85}
        />

      </mesh>

      <mesh
          position={[
              displayPlanet.x,
              displayPlanet.z,
              displayPlanet.y
          ]}
      >
          <sphereGeometry args={[1.0]} />

          <meshBasicMaterial color="white" />
      </mesh>


      <Billboard
        position={[
          displayPlanet.x,
          displayPlanet.z + 30,
          displayPlanet.y
        ]}
      >

        <Text
          fontSize={24}
          color="white"
        >
          {displayPlanet.name}
        </Text>

      </Billboard>


    </>
  );
}