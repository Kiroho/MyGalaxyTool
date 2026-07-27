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
    owner => owner.id === planet.ownerId
);

  return (
    <>

      <mesh
        position={[
          planet.x,
          planet.y,
          planet.z
        ]}
        
        onClick={(event)=>{

            event.stopPropagation();

            selectPlanet(planet);

        }}
      >

        <sphereGeometry
          args={[5]}
        />

        <meshStandardMaterial
            color={
                selectedPlanet?.id === planet.id
                    ? "yellow"
                    : owner?.color ?? "white"
            }
        />

      </mesh>


      <Billboard
        position={[
          planet.x,
          planet.y + 15,
          planet.z
        ]}
      >

        <Text
          fontSize={12}
          color="white"
        >
          {planet.name}
        </Text>

      </Billboard>


    </>
  );
}