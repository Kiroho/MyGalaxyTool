import { useState } from "react";
import buildings from "../../../data/buildings.json";
import { calculateBuildingTotalHp } from "../../../utils/calcBuilding";
import { calculateFleetDamage } from "../../../utils/calcFleet";
import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import Panel from "../Panel";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

type Volk =
    | "Tau'ri"
    | "Goa'uld"
    | "Wraith"
    | "Replikator";

type FleetCalculator = {
    T1: number;
    T2: number;
    T3: number;
    S1: number;
    S2: number;
    S3: number;
};

export default function BuildingWindow({
    onFocus,
    zIndex
}: Props){
    const openBuildingWindow =
        useUIStore(
            state => state.buildingWindow.open
        );

    const closeBuildingWindow =
        useUIStore(
            state => state.closeBuildingWindow
        );

    const owners =
        useOwnerStore(
            state => state.owners
        );

    const [selectedBuildings, setSelectedBuildings] =
        useState<
            {
                buildingId: string;
                level: number;
            }[]
        >(
            () =>
                Array.from(
                    { length: 3 },
                    () => ({
                        buildingId: "none",
                        level: 0
                    })
                )
        );

    const selectedBuildingDamage =
        selectedBuildings
            .filter(
                selection =>
                    selection.buildingId !== "none"
            )
            .map(
                selection =>
                    calculateBuildingTotalHp(
                        selection.level
                    )
            );

    const selectedBuildingCount =
        selectedBuildingDamage.length;

    const highestBuildingDamage =
        selectedBuildingCount > 0
            ? Math.max(
                ...selectedBuildingDamage
            )
            : 0;

    const selectedBuildingTotal =
        highestBuildingDamage *
        selectedBuildingCount;

    const [levels, setLevels] =
        useState<Record<string, number>>(
            () =>
                Object.fromEntries(
                    buildings.map(
                        building => [
                            building.id,
                            building.maxLevel
                        ]
                    )
                )
        );

    const totalHitpoints =
        buildings.reduce(
            (total, building) => {
                const level =
                    levels[building.id] ?? 1;

                return (
                    total +
                    calculateBuildingTotalHp(level)
                );
            },
            0
        );

    const availableVolker =
        Array.from(
            new Set(
                owners.map(
                    owner => owner.volk
                )
            )
        ).sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "de-DE",
                    {
                        sensitivity:"base"
                    }
                )
        );

    const [selectedVolk, setSelectedVolk] =
        useState<Volk>(
            availableVolker[0] ?? "Tau'ri"
        );

    const [fleetCalculator, setFleetCalculator] =
        useState<FleetCalculator>({
            T1:0,
            T2:0,
            T3:0,
            S1:0,
            S2:0,
            S3:0
        });

    const setFleetValue = (
        unit: keyof FleetCalculator,
        value: number
    ) => {
        setFleetCalculator(
            previous => ({
                ...previous,
                [unit]:
                    Math.max(
                        0,
                        value
                    )
            })
        );
    };

    const fleetDamage =
        calculateFleetDamage(
            fleetCalculator,
            selectedVolk
        );

    const buildingAttackDifference =
        fleetDamage.buildingAttack -
        selectedBuildingTotal;

    if(!openBuildingWindow)
        return null;

    return (
        <Panel
            title="Gebäuderechner"
            width={500}
            minHeight={200}
            defaultHeight={800}
            initialX={30}
            initialY={100}
            onClose={closeBuildingWindow}
            onFocus={onFocus}
            zIndex={zIndex}
            overflowVisible
        >
            {
                buildings.map(
                    building => {
                        const level =
                            levels[building.id] ?? 0;

                        const hitpoints =
                            calculateBuildingTotalHp(
                                level
                            );

                        return (
                            <div
                                key={building.id}
                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    marginBottom:"8px"
                                }}
                            >
                                <div
                                    style={{
                                        flex:1
                                    }}
                                >
                                    {building.name}
                                </div>

                                <div
                                    style={{
                                        display:"flex",
                                        alignItems:"center",
                                        marginLeft:"8px"
                                    }}
                                >
                                    <select
                                        value={level}
                                        onChange={event => {
                                            setLevels(
                                                previous => ({
                                                    ...previous,
                                                    [building.id]:
                                                        Number(
                                                            event.target.value
                                                        )
                                                })
                                            );
                                        }}
                                        style={{
                                            width:"65px"
                                        }}
                                    >
                                        {
                                            Array.from(
                                                {
                                                    length:
                                                        building.maxLevel + 1
                                                },
                                                (_, index) =>
                                                    index
                                            ).map(level => (
                                                <option
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    <button
                                        onClick={() => {
                                            setLevels(
                                                previous => ({
                                                    ...previous,
                                                    [building.id]:
                                                        Math.max(
                                                            0,
                                                            level - 1
                                                        )
                                                })
                                            );
                                        }}
                                        disabled={
                                            level <= 0
                                        }
                                        style={{
                                            width:"24px",
                                            height:"24px",
                                            padding:0,
                                            marginLeft:4
                                        }}
                                    >
                                        −
                                    </button>

                                    <button
                                        onClick={() => {
                                            setLevels(
                                                previous => ({
                                                    ...previous,
                                                    [building.id]:
                                                        Math.min(
                                                            building.maxLevel,
                                                            level + 1
                                                        )
                                                })
                                            );
                                        }}
                                        disabled={
                                            level >=
                                            building.maxLevel
                                        }
                                        style={{
                                            width:"24px",
                                            height:"24px",
                                            padding:0,
                                            marginLeft:4
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                <div
                                    style={{
                                        width:"110px",
                                        textAlign:"right",
                                        marginLeft:"2px"
                                    }}
                                >
                                    {hitpoints.toLocaleString(
                                        "de-DE"
                                    )}
                                </div>
                            </div>
                        );
                    }
                )
            }

            <div
                style={{
                    borderTop:"1px solid #666",
                    marginTop:"12px",
                    paddingTop:"10px",
                    textAlign:"right",
                    fontWeight:"bold"
                }}
            >
                Gesamt:
                {" "}
                {totalHitpoints.toLocaleString(
                    "de-DE"
                )}
            </div>

            <h3
                style={{
                    marginTop:"35px",
                    marginBottom:"10px"
                }}
            >
                Angriffsrechner
            </h3>

            <div
                style={{
                    borderTop:"1px solid #666",
                    paddingTop:"10px"
                }}
            >
                {
                    selectedBuildings.map(
                        (selection, index) => {
                            const building =
                                buildings.find(
                                    building =>
                                        building.id ===
                                        selection.buildingId
                                );

                            const level =
                                selection.level;

                            const hitpoints =
                                building
                                    ? calculateBuildingTotalHp(
                                        level
                                    )
                                    : 0;

                            return (
                                <div
                                    key={index}
                                    style={{
                                        display:"flex",
                                        alignItems:"center",
                                        marginBottom:"8px"
                                    }}
                                >
                                    <select
                                        value={
                                            selection.buildingId
                                        }
                                        onChange={event => {
                                            const buildingId =
                                                event.target.value;

                                            if(
                                                buildingId ===
                                                "none"
                                            ){
                                                setSelectedBuildings(
                                                    previous => {
                                                        const updated =
                                                            [...previous];

                                                        updated[index] = {
                                                            buildingId:
                                                                "none",
                                                            level:
                                                                0
                                                        };

                                                        return updated;
                                                    }
                                                );

                                                return;
                                            }

                                            const newBuilding =
                                                buildings.find(
                                                    building =>
                                                        building.id ===
                                                        buildingId
                                                );

                                            if(!newBuilding)
                                                return;

                                            setSelectedBuildings(
                                                previous => {
                                                    const updated =
                                                        [...previous];

                                                    updated[index] = {
                                                        buildingId:
                                                            newBuilding.id,
                                                        level:
                                                            newBuilding.maxLevel
                                                    };

                                                    return updated;
                                                }
                                            );
                                        }}
                                        style={{
                                            width:"270px",
                                            flexShrink:0
                                        }}
                                    >
                                        <option
                                            value="none"
                                        >
                                            Kein Gebäude
                                        </option>

                                        {
                                            buildings.map(
                                                building => (
                                                    <option
                                                        key={
                                                            building.id
                                                        }
                                                        value={
                                                            building.id
                                                        }
                                                    >
                                                        {
                                                            building.name
                                                        }
                                                    </option>
                                                )
                                            )
                                        }
                                    </select>

                                    {
                                        building &&
                                        <>
                                            <select
                                                value={
                                                    level
                                                }
                                                onChange={event => {
                                                    const newLevel =
                                                        Number(
                                                            event.target.value
                                                        );

                                                    setSelectedBuildings(
                                                        previous => {
                                                            const updated =
                                                                [...previous];

                                                            updated[index] = {
                                                                ...updated[index],
                                                                level:
                                                                    newLevel
                                                            };

                                                            return updated;
                                                        }
                                                    );
                                                }}
                                                style={{
                                                    width:"65px",
                                                    marginLeft:"8px"
                                                }}
                                            >
                                                {
                                                    Array.from(
                                                        {
                                                            length:
                                                                building.maxLevel + 1
                                                        },
                                                        (_, index) =>
                                                            index
                                                    ).map(level => (
                                                        <option
                                                            key={level}
                                                            value={level}
                                                        >
                                                            {level}
                                                        </option>
                                                    ))
                                                }
                                            </select>

                                            <button
                                                onClick={() => {
                                                    setSelectedBuildings(
                                                        previous => {
                                                            const updated =
                                                                [...previous];

                                                            updated[index] = {
                                                                ...updated[index],
                                                                level:
                                                                    Math.max(
                                                                        0,
                                                                        level - 1
                                                                    )
                                                            };

                                                            return updated;
                                                        }
                                                    );
                                                }}
                                                disabled={
                                                    level <= 0
                                                }
                                                style={{
                                                    width:"28px",
                                                    height:"28px",
                                                    padding:0,
                                                    marginLeft:4
                                                }}
                                            >
                                                −
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedBuildings(
                                                        previous => {
                                                            const updated =
                                                                [...previous];

                                                            updated[index] = {
                                                                ...updated[index],
                                                                level:
                                                                    Math.min(
                                                                        building.maxLevel,
                                                                        level + 1
                                                                    )
                                                            };

                                                            return updated;
                                                        }
                                                    );
                                                }}
                                                disabled={
                                                    level >=
                                                    building.maxLevel
                                                }
                                                style={{
                                                    width:"28px",
                                                    height:"28px",
                                                    padding:0,
                                                    marginLeft:4
                                                }}
                                            >
                                                +
                                            </button>
                                        </>
                                    }

                                    <div
                                        style={{
                                            width:"110px",
                                            textAlign:"right",
                                            marginLeft:"8px"
                                        }}
                                    >
                                        {
                                            building
                                                ? hitpoints.toLocaleString(
                                                    "de-DE"
                                                )
                                                : "–"
                                        }
                                    </div>
                                </div>
                            );
                        }
                    )
                }
            </div>

            <div
                style={{
                    borderTop:"1px solid #666",
                    marginTop:"10px",
                    paddingTop:"10px",
                    textAlign:"right",
                    fontWeight:"bold"
                }}
            >
                Benötigt:
                {" "}
                {selectedBuildingTotal.toLocaleString(
                    "de-DE"
                )}
            </div>

            <h3
                style={{
                    marginTop:"35px",
                    marginBottom:"10px"
                }}
            >
                Flottenrechner
            </h3>

            <div
                style={{
                    borderTop:"1px solid #666",
                    paddingTop:"10px"
                }}
            >
                <div
                    style={{
                        display:"flex",
                        alignItems:"center",
                        gap:"12px"
                    }}
                >
                    <select
                        value={selectedVolk}
                        onChange={event => {
                            setSelectedVolk(
                                event.target.value as Volk
                            );
                        }}
                        style={{
                            width:"85px"
                        }}
                    >
                        {
                            availableVolker.map(
                                volk => (
                                    <option
                                        key={volk}
                                        value={volk}
                                    >
                                        {volk}
                                    </option>
                                )
                            )
                        }
                    </select>

                    <div
                        style={{
                            display:"flex",
                            flexDirection:"column",
                            gap:"4px"
                        }}
                    >
                        <div
                            style={{
                                display:"flex",
                                gap:"12px"
                            }}
                        >
                            {
                                [
                                    "T1",
                                    "T2",
                                    "T3"
                                ].map(
                                    unit => (
                                        <div
                                            key={unit}
                                            style={{
                                                display:"flex",
                                                alignItems:"center",
                                                gap:"0px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width:"22px",
                                                    fontSize:"14px"
                                                }}
                                            >
                                                {unit}
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                value={
                                                    fleetCalculator[
                                                        unit as keyof FleetCalculator
                                                    ]
                                                }
                                                onChange={event => {
                                                    setFleetValue(
                                                        unit as keyof FleetCalculator,
                                                        Number(
                                                            event.target.value
                                                        )
                                                    );
                                                }}
                                                style={{
                                                    width:"55px",
                                                    textAlign:"center"
                                                }}
                                            />
                                        </div>
                                    )
                                )
                            }
                        </div>

                        <div
                            style={{
                                display:"flex",
                                gap:"12px"
                            }}
                        >
                            {
                                [
                                    "S1",
                                    "S2",
                                    "S3"
                                ].map(
                                    unit => (
                                        <div
                                            key={unit}
                                            style={{
                                                display:"flex",
                                                alignItems:"center",
                                                gap:"0px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width:"22px",
                                                    fontSize:"14px"
                                                }}
                                            >
                                                {unit}
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                value={
                                                    fleetCalculator[
                                                        unit as keyof FleetCalculator
                                                    ]
                                                }
                                                onChange={event => {
                                                    setFleetValue(
                                                        unit as keyof FleetCalculator,
                                                        Number(
                                                            event.target.value
                                                        )
                                                    );
                                                }}
                                                style={{
                                                    width:"55px",
                                                    textAlign:"center"
                                                }}
                                            />
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>

                    <div
                        style={{
                            marginLeft:"auto",
                            textAlign:"right",
                            fontWeight:"bold"
                        }}
                    >
                        Gebäude:
                        {" "}
                        {fleetDamage.buildingAttack.toLocaleString(
                            "de-DE"
                        )}
                    </div>
                </div>
            </div>

            <div
                style={{
                    borderTop:"1px solid #666",
                    marginTop:"10px",
                    paddingTop:"10px",
                    textAlign:"right",
                    fontWeight:"bold",
                    color:
                        buildingAttackDifference >= 0
                            ? "#66ff88"
                            : "#ff6666"
                }}
            >
                Vergleich:
                {" "}
                {
                    buildingAttackDifference >= 0
                        ? "+"
                        : ""
                }
                {
                    buildingAttackDifference.toLocaleString(
                        "de-DE"
                    )
                }
            </div>
        </Panel>
    );
}