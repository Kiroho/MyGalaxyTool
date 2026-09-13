import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../Panel";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
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

    const owners =
        useOwnerStore(
            state => state.owners
        );

    const [startPlanetId, setStartPlanetId] =
        useState("");

    const [startPlanetDropdownOpen, setStartPlanetDropdownOpen] =
        useState(false);

    const [startKeyboardIndex, setStartKeyboardIndex] =
        useState(-1);

    const [minimumDistance, setMinimumDistance] =
        useState(3000);

    const [result, setResult] =
        useState<{
            x: number;
            y: number;
            z: number;
        } | null>(null);

    const lastSearchKey =
        useRef("");

    const lastSearchIndex =
        useRef(-1);

    const startPlanetDropdownRef =
        useRef<HTMLDivElement>(null);

    const startPlanetOptionRefs =
        useRef<Record<string, HTMLDivElement | null>>({});

    const sortedPlanets =
        useMemo(
            () =>
                [...planets].sort(
                    (a, b) => {
                        const ownerA =
                            owners.find(
                                owner =>
                                    owner.id ===
                                    a.owner_id
                            );

                        const ownerB =
                            owners.find(
                                owner =>
                                    owner.id ===
                                    b.owner_id
                            );

                        const ownerComparison =
                            (
                                ownerA?.name ??
                                "Unbekannt"
                            ).localeCompare(
                                ownerB?.name ??
                                "Unbekannt",
                                "de",
                                {
                                    sensitivity:
                                        "base"
                                }
                            );

                        if(
                            ownerComparison !== 0
                        ){
                            return ownerComparison;
                        }

                        return a.name.localeCompare(
                            b.name,
                            "de",
                            {
                                sensitivity:
                                    "base"
                            }
                        );
                    }
                ),
            [
                planets,
                owners
            ]
        );

    const selectedStartPlanet =
        planets.find(
            planet =>
                planet.id ===
                startPlanetId
        );

    const selectedStartPlanetOwner =
        owners.find(
            owner =>
                owner.id ===
                selectedStartPlanet?.owner_id
        );

    const resetKeyboardSearch = () => {
        lastSearchKey.current =
            "";

        lastSearchIndex.current =
            -1;
    };

    const closeStartDropdown = () => {
        setStartPlanetDropdownOpen(
            false
        );

        setStartKeyboardIndex(
            -1
        );

        resetKeyboardSearch();
    };

    const confirmKeyboardSelection = () => {
        if(
            startKeyboardIndex < 0 ||
            startKeyboardIndex >=
                sortedPlanets.length
        ){
            return;
        }

        const planet =
            sortedPlanets[
                startKeyboardIndex
            ];

        setStartPlanetId(
            planet.id
        );

        closeStartDropdown();
    };

    const handlePlanetKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if(
            sortedPlanets.length === 0
        ){
            return;
        }

        if(event.key === "ArrowDown"){
            event.preventDefault();

            setStartKeyboardIndex(
                prev =>
                    prev < 0
                        ? 0
                        : (
                            prev + 1
                        ) %
                        sortedPlanets.length
            );

            resetKeyboardSearch();

            return;
        }

        if(event.key === "ArrowUp"){
            event.preventDefault();

            setStartKeyboardIndex(
                prev =>
                    prev < 0
                        ? sortedPlanets.length - 1
                        : (
                            prev -
                            1 +
                            sortedPlanets.length
                        ) %
                        sortedPlanets.length
            );

            resetKeyboardSearch();

            return;
        }

        if(event.key === "Enter"){
            event.preventDefault();

            confirmKeyboardSelection();

            return;
        }

        if(event.key === "Escape"){
            event.preventDefault();

            closeStartDropdown();

            return;
        }

        if(
            !/^[a-zA-ZäöüÄÖÜß]$/.test(
                event.key
            )
        ){
            return;
        }

        const searchKey =
            event.key.toLocaleLowerCase(
                "de"
            );

        const matchingIndices =
            sortedPlanets
                .map(
                    (
                        planet,
                        index
                    ) => ({
                        planet,
                        index
                    })
                )
                .filter(
                    item =>
                        item.planet.name
                            .toLocaleLowerCase(
                                "de"
                            )
                            .startsWith(
                                searchKey
                            )
                );

        if(
            matchingIndices.length === 0
        ){
            return;
        }

        let nextIndex = 0;

        if(
            lastSearchKey.current ===
            searchKey
        ){
            nextIndex =
                (
                    lastSearchIndex.current +
                    1
                ) %
                matchingIndices.length;
        }

        const matchingItem =
            matchingIndices[
                nextIndex
            ];

        setStartKeyboardIndex(
            matchingItem.index
        );

        lastSearchKey.current =
            searchKey;

        lastSearchIndex.current =
            nextIndex;
    };

    useEffect(() => {
        if(
            !startPlanetDropdownOpen
        ){
            return;
        }

        startPlanetDropdownRef.current?.focus();
    }, [
        startPlanetDropdownOpen
    ]);

    useEffect(() => {
        if(
            startKeyboardIndex < 0 ||
            startKeyboardIndex >=
                sortedPlanets.length
        ){
            return;
        }

        const planet =
            sortedPlanets[
                startKeyboardIndex
            ];

        startPlanetOptionRefs.current[
            planet.id
        ]?.scrollIntoView({
            block: "nearest"
        });
    }, [
        startKeyboardIndex,
        sortedPlanets
    ]);

    const generatePosition = () => {
        const startPlanet =
            planets.find(
                planet =>
                    planet.id ===
                    startPlanetId
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
                            marginBottom:
                                "15px"
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
                                marginTop:
                                    "15px"
                            }}
                            onClick={() => {
                                openCreatePlanetWithPosition({
                                    x: Math.round(
                                        result.x
                                    ),
                                    y: Math.round(
                                        result.y
                                    ),
                                    z: Math.round(
                                        result.z
                                    )
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
            overflowVisible
        >
            <h4
                style={{
                    marginBottom:
                        "7px"
                }}
            >
                Startplanet
            </h4>

            <div
                style={{
                    position:
                        "relative",
                    width:
                        "100%"
                }}
            >
                <button
                    onClick={() => {
                        if(
                            startPlanetDropdownOpen
                        ){
                            closeStartDropdown();

                            return;
                        }

                        setStartKeyboardIndex(
                            -1
                        );

                        resetKeyboardSearch();

                        setStartPlanetDropdownOpen(
                            true
                        );

                        window.setTimeout(
                            () => {
                                startPlanetDropdownRef.current?.focus();
                            },
                            0
                        );
                    }}
                    style={{
                        width:
                            "100%",
                        padding:
                            "2px 8px",
                        cursor:
                            "pointer",
                        textAlign:
                            "left",
                        boxSizing:
                            "border-box"
                    }}
                >
                    {
                        selectedStartPlanet
                            ? (
                                <span
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap:
                                            "6px"
                                    }}
                                >
                                    <span
                                        style={{
                                            width:
                                                "12px",
                                            height:
                                                "12px",
                                            borderRadius:
                                                "50%",
                                            background:
                                                selectedStartPlanetOwner?.color ??
                                                "white",
                                            flexShrink:
                                                0
                                        }}
                                    />

                                    {
                                        selectedStartPlanet.name
                                    }
                                </span>
                            )
                            : "Planet auswählen"
                    }
                </button>

                {
                    startPlanetDropdownOpen &&
                    <div
                        ref={
                            startPlanetDropdownRef
                        }
                        tabIndex={0}
                        onKeyDown={
                            handlePlanetKeyDown
                        }
                        style={{
                            position:
                                "absolute",
                            top:
                                "100%",
                            left:
                                0,
                            width:
                                "100%",
                            background:
                                "#102544",
                            border:
                                "1px solid #ffffff33",
                            padding:
                                "8px",
                            boxSizing:
                                "border-box",
                            zIndex:
                                20,
                            maxHeight:
                                "450px",
                            overflowY:
                                "auto",
                            outline:
                                "none"
                        }}
                    >
                        {
                            sortedPlanets.map(
                                (
                                    planet,
                                    index
                                ) => {
                                    const owner =
                                        owners.find(
                                            owner =>
                                                owner.id ===
                                                planet.owner_id
                                        );

                                    return (
                                        <div
                                            key={
                                                planet.id
                                            }
                                            ref={
                                                element => {
                                                    startPlanetOptionRefs.current[
                                                        planet.id
                                                    ] =
                                                        element;
                                                }
                                            }
                                            onClick={() => {
                                                setStartPlanetId(
                                                    planet.id
                                                );

                                                closeStartDropdown();
                                            }}
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "6px",
                                                padding:
                                                    "5px",
                                                cursor:
                                                    "pointer",
                                                background:
                                                    startKeyboardIndex ===
                                                    index
                                                        ? "#ffffff22"
                                                        : "transparent"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width:
                                                        "12px",
                                                    height:
                                                        "12px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        owner?.color ??
                                                        "white",
                                                    flexShrink:
                                                        0
                                                }}
                                            />

                                            <span>
                                                {
                                                    planet.name
                                                }
                                            </span>
                                        </div>
                                    );
                                }
                            )
                        }
                    </div>
                }
            </div>

            <h4
                style={{
                    marginBottom:
                        "5px"
                }}
            >
                Mindestabstand
            </h4>

            <input
                type="range"
                step="50"
                min="0"
                max="3600"
                value={
                    minimumDistance
                }
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
                    marginBottom:
                        "15px"
                }}
            >
                {
                    minimumDistance
                }{" "}
                lj
            </div>

            <button
                onClick={
                    generatePosition
                }
            >
                Position berechnen
            </button>
        </Panel>
    );
}