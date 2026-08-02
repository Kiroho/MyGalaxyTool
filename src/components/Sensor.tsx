import type { Planet as PlanetType } from "../types/planet";


type Props = {
    planet: PlanetType;
};


export default function Sensor({
    planet
}: Props) {


    return (

        <mesh

            position={[
                planet.x,
                planet.z,
                planet.y
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