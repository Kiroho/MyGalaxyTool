import { useEffect, useState } from "react";
import { calculateFleetDamage } from "../../../utils/calcFleet";
import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { useFleetStore } from "../../../store/fleetStore";

import Panel from "../Panel";


export default function FleetWindow() {


    const openFleetWindow =
        useUIStore(
            state => state.fleetWindow.open
        );


    const closeFleetWindow =
        useUIStore(
            state => state.closeFleetWindow
        );


    const owners =
        useOwnerStore(
            state => state.owners
        );


    const fleets =
        useFleetStore(
            state => state.fleets
        );


    const loadFleet =
        useFleetStore(
            state => state.loadFleet
        );


    const createFleet =
        useFleetStore(
            state => state.createFleet
        );


    const updateFleet =
        useFleetStore(
            state => state.updateFleet
        );


    /*
        Welcher Besitzer wird gerade bearbeitet?
    */

    const [
        editingOwnerId,
        setEditingOwnerId
    ] =
        useState<string | null>(
            null
        );


    /*
        Temporäre Änderungen.

        Hier werden nur die Werte gespeichert,
        die während der Bearbeitung verändert wurden.
    */

    const [
        editedFleets,
        setEditedFleets
    ] =
        useState<
            Record<
                string,
                Record<string, number>
            >
        >({});


    useEffect(() => {

        if(!openFleetWindow)
            return;


        const loadAllFleets =
            async () => {

                for(
                    const owner
                    of owners
                ){

                    try {

                        await loadFleet(
                            owner.id
                        );

                    } catch {

                        try {

                            await createFleet(
                                owner.id
                            );

                        } catch(error) {

                            console.error(
                                "Flotte konnte nicht erstellt werden:",
                                owner.id,
                                error
                            );

                        }

                    }

                }

            };


        loadAllFleets();

    }, [
        openFleetWindow,
        owners,
        loadFleet,
        createFleet
    ]);


    /*
        Öffnet die Bearbeitung für einen Besitzer.
    */

    const startEditing = (
        ownerId: string
    ) => {

        const fleet =
            fleets[
                ownerId
            ];


        if(!fleet)
            return;


        /*
            Eine Kopie der aktuellen Flotte
            als temporären Bearbeitungsstand.
        */

        setEditedFleets(
            previous => ({

                ...previous,

                [ownerId]: {

                    T1: fleet.T1,

                    T2: fleet.T2,

                    T3: fleet.T3,

                    S1: fleet.S1,

                    S2: fleet.S2,

                    S3: fleet.S3

                }

            })
        );


        setEditingOwnerId(
            ownerId
        );

    };


    /*
        Bearbeitung abbrechen.
    */

    const cancelEditing = () => {

        if(
            editingOwnerId === null
        )
            return;


        setEditedFleets(
            previous => {

                const updated =
                    {
                        ...previous
                    };


                delete updated[
                    editingOwnerId
                ];


                return updated;

            }
        );


        setEditingOwnerId(
            null
        );

    };


    /*
        Wert im Bearbeitungsbereich ändern.
    */

    const setFleetValue = (
        ownerId: string,
        unit: string,
        value: number
    ) => {

        setEditedFleets(
            previous => ({

                ...previous,

                [ownerId]: {

                    ...previous[ownerId],

                    [unit]:
                        Math.max(
                            0,
                            value
                        )

                }

            })
        );

    };


    /*
        Flotte speichern.
    */

    const saveFleet = async (
        ownerId: string
    ) => {

        const changes =
            editedFleets[
                ownerId
            ];


        if(!changes)
            return;


        try {

            await updateFleet(
                ownerId,
                changes
            );


            setEditedFleets(
                previous => {

                    const updated =
                        {
                            ...previous
                        };


                    delete updated[
                        ownerId
                    ];


                    return updated;

                }
            );


            setEditingOwnerId(
                null
            );


        } catch(error) {

            console.error(
                "Flotte konnte nicht gespeichert werden:",
                error
            );

        }

    };


    /*
        Temporären Wert aus dem Bearbeitungsstand holen.
    */

    const getEditedValue = (
        ownerId: string,
        unit: string,
        fallback: number
    ) => {

        return (
            editedFleets[
                ownerId
            ]?.[
                unit
            ]
            ??
            fallback
        );

    };


    if(!openFleetWindow)
        return null;


    return (

        <Panel

            title="Flottenübersicht"

            width={1200}

            minHeight={300}

            initialX={30}

            initialY={100}

            onClose={closeFleetWindow}

        >

            <div
                style={{
                    overflowX:"auto",
                    width:"100%"
                }}
            >

                <table

                    style={{

                        width:"100%",

                        borderCollapse:"collapse",

                        whiteSpace:"nowrap",
                        tableLayout:"fixed"

                    }}

                >



                    <colgroup>

                        <col style={{ width:"140px" }} />
                        <col style={{ width:"100px" }} />

                        <col style={{ width:"75px" }} />
                        <col style={{ width:"75px" }} />
                        <col style={{ width:"75px" }} />

                        <col style={{ width:"75px" }} />
                        <col style={{ width:"75px" }} />
                        <col style={{ width:"75px" }} />

                        <col style={{ width:"110px" }} />
                        <col style={{ width:"140px" }} />

                        <col style={{ width:"150px" }} />

                    </colgroup>


                    <thead>

                        <tr>

                            <th
                                style={{
                                    textAlign:"left",
                                    padding:"8px"
                                }}
                            >
                                Besitzer
                            </th>


                            <th
                                style={{
                                    textAlign:"left",
                                    padding:"8px"
                                }}
                            >
                                Volk
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                T1
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                T2
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                T3
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                S1
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                S2
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                S3
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                Angriff
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                Gebäudeangriff
                            </th>


                            <th
                                style={{
                                    padding:"8px"
                                }}
                            >
                                Aktion
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            owners.map(
                                owner => {

                                    const fleet =
                                        fleets[
                                            owner.id
                                        ];


                                    if(!fleet)
                                        return null;


                                    const isEditing =
                                        editingOwnerId ===
                                        owner.id;


                                    /*
                                        Normale gespeicherte
                                        Flottenwerte.
                                    */

                                    const damage =
                                        calculateFleetDamage(
                                            fleet,
                                            owner.volk
                                        );


                                    /*
                                        Temporäre Flotte für
                                        die Live-Berechnung.
                                    */

                                    const editedFleet =
                                        isEditing
                                            ? {

                                                ...fleet,

                                                ...editedFleets[
                                                    owner.id
                                                ]

                                            }
                                            : null;


                                    const editedDamage =
                                        editedFleet
                                            ? calculateFleetDamage(
                                                editedFleet,
                                                owner.volk
                                            )
                                            : null;


                                    return (

                                        <>
                                        
                                            <tr
                                                key={
                                                    owner.id
                                                }
                                            >

                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22"
                                                    }}
                                                >

                                                    {owner.name}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22"
                                                    }}
                                                >

                                                    {owner.volk}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.T1.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.T2.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.T3.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.S1.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.S2.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    {fleet.S3.toLocaleString("de-DE")}

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"right"
                                                    }}
                                                >

                                                    {
                                                        damage.attack.toLocaleString(
                                                            "de-DE"
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"right"
                                                    }}
                                                >

                                                    {
                                                        damage.buildingAttack.toLocaleString(
                                                            "de-DE"
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    style={{
                                                        padding:"8px",
                                                        borderTop:
                                                            "1px solid #ffffff22",
                                                        textAlign:"center"
                                                    }}
                                                >

                                                    <button

                                                        onClick={() => {

                                                            if(
                                                                isEditing
                                                            ){

                                                                cancelEditing();

                                                            } else {

                                                                startEditing(
                                                                    owner.id
                                                                );

                                                            }

                                                        }}

                                                    >

                                                        {
                                                            isEditing
                                                                ? "Abbrechen"
                                                                : "Bearbeiten"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>


{
    isEditing
    &&
    editedFleet
    &&
    editedDamage
    &&
    <tr
        key={
            owner.id +
            "-edit"
        }
    >

        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22"
            }}
        >
        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22"
            }}
        >
        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "T1",
                        fleet.T1
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "T1",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "T2",
                        fleet.T2
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "T2",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "T3",
                        fleet.T3
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "T3",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "S1",
                        fleet.S1
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "S1",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "S2",
                        fleet.S2
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "S2",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <input

                type="number"

                min="0"

                value={
                    getEditedValue(
                        owner.id,
                        "S3",
                        fleet.S3
                    )
                }

                onChange={
                    event => {

                        setFleetValue(

                            owner.id,

                            "S3",

                            Number(
                                event.target.value
                            )

                        );

                    }
                }

                style={{
                    width:"65px",
                    textAlign:"center"
                }}

            />

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"right",
                fontWeight:"bold"
            }}
        >

            {
                editedDamage.attack.toLocaleString(
                    "de-DE"
                )
            }

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"right",
                fontWeight:"bold"
            }}
        >

            {
                editedDamage.buildingAttack.toLocaleString(
                    "de-DE"
                )
            }

        </td>


        <td
            style={{
                padding:"8px",
                borderTop:
                    "1px solid #ffffff22",
                textAlign:"center"
            }}
        >

            <div
                style={{
                    display:"flex",
                    gap:"6px",
                    justifyContent:"center"
                }}
            >

                <button

                    onClick={() => {

                        saveFleet(
                            owner.id
                        );

                    }}

                >

                    Speichern

                </button>


            </div>

        </td>

    </tr>
}

                                        </>

                                    );

                                }
                            )
                        }

                    </tbody>

                </table>

            </div>

        </Panel>

    );

}