import type { Planet as PlanetType } from "../types/planet";
import { usePlanetStore } from "../store/planetStore";


type Props = {
    planet: PlanetType;
};


export default function Sensor({
    planet
}: Props) {

    const previewPlanet = usePlanetStore(
        state => state.previewPlanet
    );

    const displayPlanet =
        previewPlanet?.id === planet.id
            ? previewPlanet
            : planet;

    return (

        <mesh

            position={[
                displayPlanet.x,
                displayPlanet.z,
                displayPlanet.y
            ]}

        >

            <sphereGeometry
                args={[150]}
            />


            <meshBasicMaterial

                color="cyan"

                transparent={true}

                opacity={0.20}

                wireframe
                //depthWrite={false}

            />


        </mesh>

    );

}