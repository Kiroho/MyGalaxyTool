import { useState } from "react";
import Panel from "../Panel";
import { usePlanetStore } from "../../../store/planetStore";
import { useUIStore } from "../../../store/uiStore";
import { calculateSensorPosition } from "../../../utils/sensorNetwork";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

export default function SensorNetworkGeneratorWindow({
    onFocus,
    zIndex
}: Props) {
    const sensorNetworkWindowOpen =
        useUIStore(
            state => state.sensorNetworkWindow.open
        );

    const closeSensorNetworkWindow =
        useUIStore(
            state => state.closeSensorNetworkWindow
        );

    const openCreatePlanetWithPosition =
        useUIStore(
            state => state.openCreatePlanetWithPosition
        );

    const planets =
        usePlanetStore(
            state => state.planets
        );

    const [startPlanetId, setStartPlanetId] =
        useState("");

    const [minimumDistance, setMinimumDistance] =
        useState(3000);

    const [result, setResult] =
        useState<{
            x: number;
            y: number;
            z: number;
        } | null>(null);

    const generatePosition = () => {
        const startPlanet =
            planets.find(
                planet =>
                    planet.id === startPlanetId
            );

        if(!startPlanet){
            return;
        }

        const radiusXYZ =
            minimumDistance / 12;

        const position =
            calculateSensorPosition(
                {
                    x: startPlanet.x,
                    y: startPlanet.y,
                    z: startPlanet.z
                },
                planets,
                radiusXYZ
            );

        setResult(position);
    };

    if(!sensorNetworkWindowOpen){
        return null;
    }

    const validResult =
        result &&
        result.x !== 0 &&
        result.y !== 0 &&
        result.z !== 0;

    const resultExtension =
        result && (
            <div>
                {
                    result.x === 0 &&
                    result.y === 0 &&
                    result.z === 0 &&
                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >
                        Keine passende Position gefunden
                    </div>
                }

                {
                    validResult &&
                    <div>
                        <div>
                            X: {Math.round(result.x)}
                        </div>

                        <div>
                            Y: {Math.round(result.y)}
                        </div>

                        <div>
                            Z: {Math.round(result.z)}
                        </div>

                        <button
                            style={{
                                marginTop: "15px"
                            }}
                            onClick={() => {
                                openCreatePlanetWithPosition({
                                    x: Math.round(result.x),
                                    y: Math.round(result.y),
                                    z: Math.round(result.z)
                                });
                            }}
                        >
                            🌍 Planet setzen
                        </button>
                    </div>
                }
            </div>
        );

    return (
        <Panel
            title="Sensornetz Generator"
            width={250}
            defaultHeight={300}
            initialX={700}
            initialY={100}
            onClose={closeSensorNetworkWindow}
            onFocus={onFocus}
            zIndex={zIndex}
            extension={resultExtension}
        >
            <h4
                style={{
                    marginBottom: "7px"
                }}
            >
                Startplanet
            </h4>

            <select
                value={startPlanetId}
                onChange={event =>
                    setStartPlanetId(
                        event.target.value
                    )
                }
            >
                <option value="">
                    Planet auswählen
                </option>

                {
                    planets.map(planet => (
                        <option
                            key={planet.id}
                            value={planet.id}
                        >
                            {planet.name}
                        </option>
                    ))
                }
            </select>

            <h4
                style={{
                    marginBottom: "5px"
                }}
            >
                Mindestabstand
            </h4>

            <input
                type="range"
                step="50"
                min="0"
                max="3600"
                value={minimumDistance}
                onChange={event =>
                    setMinimumDistance(
                        Number(
                            event.target.value
                        )
                    )
                }
            />

            <div
                style={{
                    marginBottom: "15px"
                }}
            >
                {minimumDistance} lj
            </div>

            <button
                onClick={generatePosition}
            >
                Position berechnen
            </button>
        </Panel>
    );
}