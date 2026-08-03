import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import Planet from "./Planet";
import CoordinateSystem from "./CoordinateSystem";
import CoordinateLabels from "./CoordinateLabels";

import { getPlanets } from "../services/PlanetService";
import { usePlanetStore } from "../store/planetStore";

import { getOwners } from "../services/OwnerService";
import { useOwnerStore } from "../store/ownerStore";

import { useUIStore } from "../store/uiStore";
import Sensor from "./Sensor";


export default function GalaxyScene(){

    const setOwners = useOwnerStore(
    state => state.setOwners
    );


    const planets = usePlanetStore(
        state => state.planets
    );

    const setPlanets = usePlanetStore(
        state => state.setPlanets
    );

    const showSensors = useUIStore(
        state => state.showSensors
    );

    const selectedOwnerIds = useUIStore(
        state => state.selectedOwnerIds
    );


    useEffect(()=>{

        getPlanets()
            .then(setPlanets);

        getOwners()
            .then(setOwners);

    }, [setPlanets, setOwners]);


    const clearSelection = usePlanetStore(
        state => state.clearSelection
    );

    return (

        <Canvas
            camera={{
                position: [2500, 2500, 2500],
                fov: 45,
                near:1,
                far:10000
            }}

            onPointerMissed={()=>{
                clearSelection();
            }}
        >

            <color 
                attach="background" 
                args={["#101820"]} 
            />

            <ambientLight intensity={1}/>

            <directionalLight 
                position={[5,5,5]}
            />


            <CoordinateSystem />
            <CoordinateLabels />

            {
                planets
                .filter(planet =>
                    selectedOwnerIds.includes(
                        planet.ownerId
                    )
                )
                .map((planet)=>(

                    <group key={planet.id}>

                        <Planet
                            planet={planet}
                        />


                        {
                            showSensors && (

                                <Sensor
                                    planet={planet}
                                />

                            )
                        }

                    </group>

                ))
            }


            <OrbitControls
                target={[761,761,761]}
                enableDamping={false}
                minDistance={200}
                maxDistance={5000}
                rotateSpeed={0.5}
                zoomSpeed={1}
            />
            

        </Canvas>
        

    )

}