import { useState } from "react";
import buildings from "../../../data/buildings.json";
import { calculateBuildingTotalHp } from "../../../utils/calcBuilding";
import Panel from "../Panel";
import { useUIStore } from "../../../store/uiStore";

export default function BuildingWindow(){


    const openBuildingWindow = useUIStore(
        state => state.buildingWindow.open
    );

    const closeBuildingWindow = useUIStore(
        state => state.closeBuildingWindow
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
                        buildingId:
                            buildings[0]?.id ?? "",

                        level:
                            buildings[0]?.maxLevel ?? 0
                    })
                )
        );

    const selectedBuildingMaxHp =
        Math.max(
            ...selectedBuildings.map(selection => {

                return calculateBuildingTotalHp(
                    selection.level
                );

            })
        );


    const selectedBuildingTotal =
        selectedBuildingMaxHp * 3;



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



    if(!openBuildingWindow)
        return null;


    return (

        <Panel
            title="Gebäuderechner"
            width={400}
            minHeight={200}
            initialX={30}
            initialY={100}
            onClose={closeBuildingWindow}
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

                                            setLevels(previous => ({

                                                ...previous,

                                                [building.id]:
                                                    Math.max(
                                                        0,
                                                        level - 1
                                                    )

                                            }));

                                        }}
                                        disabled={level <= 0}
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

                                            setLevels(previous => ({

                                                ...previous,

                                                [building.id]:
                                                    Math.min(
                                                        building.maxLevel,
                                                        level + 1
                                                    )

                                            }));

                                        }}
                                        disabled={
                                            level >= building.maxLevel
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
                {" "}

            </div>




            <h3
                style={{
                    marginTop:"35px",
                    marginBottom:"10px"
                }}
            >
                Angriffsrechner</h3>

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


                            if(!building)
                                return null;


                            const level =
                                selection.level;


                            const hitpoints =
                                calculateBuildingTotalHp(
                                    level
                                );


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

                                            const newBuilding =
                                                buildings.find(
                                                    building =>
                                                        building.id ===
                                                        event.target.value
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
                                            flex:1
                                        }}

                                    >

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


                                    <select

                                        value={level}

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


                                    <div
                                        style={{
                                            width:"110px",
                                            textAlign:"right",
                                            marginLeft:"8px"
                                        }}
                                    >
                                        {
                                            hitpoints.toLocaleString(
                                                "de-DE"
                                            )
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



        </Panel>

    );

}