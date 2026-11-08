import type { Planet as PlanetType } from "../types/planet";
import { usePlanetStore } from "../store/planetStore";
import { useSensorStore } from "../store/sensorStore";
import { getSensorRadius } from "../utils/sensorRange";

type Props = {
    planet: PlanetType;
};

export default function Sensor({ planet }: Props) {
    const previewPlanet = usePlanetStore(state => state.previewPlanet);
    const selectedPlanet = usePlanetStore(state => state.selectedPlanet);
    const sensorLevel = useSensorStore(state => state.sensorLevels[planet.id] ?? 20);

    const displayPlanet =
        previewPlanet?.id === planet.id
            ? previewPlanet
            : planet;

    const isSelected = selectedPlanet?.id === planet.id;
    const radius = getSensorRadius(sensorLevel);

    return (
        <mesh position={[displayPlanet.x, displayPlanet.z, displayPlanet.y]}>
            <sphereGeometry args={[radius]} />
            <meshBasicMaterial color={isSelected ? "#ff1744" : "cyan"} transparent={true} opacity={0.20} wireframe />
        </mesh>
    );
}