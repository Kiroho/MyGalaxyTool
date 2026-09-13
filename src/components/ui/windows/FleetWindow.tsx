import { Fragment, useEffect, useRef, useState } from "react";
import { calculateFleetDamage } from "../../../utils/calcFleet";
import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { useFleetStore } from "../../../store/fleetStore";
import Panel from "../Panel";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

const fleetFilterStorageKey =
    "galaxy_fleet_filter_owners";

export default function FleetWindow({
    onFocus,
    zIndex
}: Props) {
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

    const [
        editingOwnerId,
        setEditingOwnerId
    ] =
        useState<string | null>(
            null
        );

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

    const [apiMessage, setApiMessage] =
        useState("");

    const [apiMessageType, setApiMessageType] =
        useState<
            "success" | "error" | "info"
        >("info");

    const [
        selectedOwnerIds,
        setSelectedOwnerIds
    ] =
        useState<string[]>(() => {
            const stored =
                localStorage.getItem(
                    fleetFilterStorageKey
                );

            if(stored === null){
                return [];
            }

            try{
                const parsed =
                    JSON.parse(
                        stored
                    );

                if(
                    Array.isArray(parsed)
                ){
                    return parsed;
                }
            }
            catch(error){
                console.error(
                    "Flottenfilter konnte nicht aus localStorage geladen werden:",
                    error
                );
            }

            return [];
        });

    const [
        ownerDropdownOpen,
        setOwnerDropdownOpen
    ] =
        useState(false);

    const ownerDropdownRef =
        useRef<HTMLDivElement>(null);

    const ownerDropdownButtonRef =
        useRef<HTMLButtonElement>(null);

    const [
        ownerDropdownPosition,
        setOwnerDropdownPosition
    ] =
        useState({
            top: 0,
            left: 0
        });

    useEffect(() => {
        if(!openFleetWindow){
            return;
        }

        const loadAllFleets =
            async () => {
                for(
                    const owner
                    of owners
                ){
                    try{
                        await loadFleet(
                            owner.id
                        );
                    }
                    catch{
                        try{
                            await createFleet(
                                owner.id
                            );
                        }
                        catch(createError){
                            console.error(
                                "Flotte konnte nicht erstellt werden:",
                                owner.id,
                                createError
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

    useEffect(() => {
        const handleClick = (
            event: MouseEvent
        ) => {
            if(
                ownerDropdownRef.current &&
                !ownerDropdownRef.current.contains(
                    event.target as Node
                )
            ){
                setOwnerDropdownOpen(
                    false
                );
            }
        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClick
            );
        };
    }, []);

    const storedFleetFilter =
        localStorage.getItem(
            fleetFilterStorageKey
        );

    const filteredOwnerIds =
        storedFleetFilter === null
            ? owners.map(
                owner =>
                    owner.id
            )
            : selectedOwnerIds.filter(
                ownerId =>
                    owners.some(
                        owner =>
                            owner.id ===
                            ownerId
                    )
            );

    const filteredOwners =
        owners.filter(
            owner =>
                filteredOwnerIds.includes(
                    owner.id
                )
        );

    const saveOwnerFilter = (
        ownerIds: string[]
    ) => {
        localStorage.setItem(
            fleetFilterStorageKey,
            JSON.stringify(
                ownerIds
            )
        );
    };

    const selectAllOwners = () => {
        const ownerIds =
            owners.map(
                owner =>
                    owner.id
            );

        setSelectedOwnerIds(
            ownerIds
        );

        saveOwnerFilter(
            ownerIds
        );
    };

    const deselectAllOwners = () => {
        setSelectedOwnerIds([]);

        saveOwnerFilter([]);
    };

    const toggleOwner = (
        ownerId: string
    ) => {
        const nextOwnerIds =
            selectedOwnerIds.includes(
                ownerId
            )
                ?
                selectedOwnerIds.filter(
                    id =>
                        id !==
                        ownerId
                )
                :
                [
                    ...selectedOwnerIds,
                    ownerId
                ];

        setSelectedOwnerIds(
            nextOwnerIds
        );

        saveOwnerFilter(
            nextOwnerIds
        );
    };

    const startEditing = (
        ownerId: string
    ) => {
        const fleet =
            fleets[
                ownerId
            ];

        if(!fleet){
            return;
        }

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

    const cancelEditing = () => {
        if(
            editingOwnerId === null
        ){
            return;
        }

        setEditedFleets(
            previous => {
                const updated = {
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

    const saveFleet = async (
        ownerId: string
    ) => {
        const changes =
            editedFleets[
                ownerId
            ];

        if(!changes){
            return;
        }

        try{
            await updateFleet(
                ownerId,
                changes
            );

            setEditedFleets(
                previous => {
                    const updated = {
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

            setApiMessage(
                "✓ Flotte gespeichert"
            );

            setApiMessageType(
                "success"
            );
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Flotte konnte nicht gespeichert werden.";

            setApiMessage(
                "✕ " + message
            );

            setApiMessageType(
                "error"
            );
        }
    };

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

    const toggleOwnerDropdown = () => {
        if(
            !ownerDropdownOpen &&
            ownerDropdownButtonRef.current
        ){
            const rect =
                ownerDropdownButtonRef.current.getBoundingClientRect();

            setOwnerDropdownPosition({
                top:
                    rect.bottom + 4,
                left:
                    rect.left
            });
        }

        setOwnerDropdownOpen(
            previous =>
                !previous
        );
    };

    if(!openFleetWindow){
        return null;
    }

    return (
        <Panel
            title="Flottenübersicht"
            width={1250}
            minHeight={300}
            defaultHeight={750}
            initialX={30}
            initialY={100}
            onClose={closeFleetWindow}
            onFocus={onFocus}
            zIndex={zIndex}
            message={apiMessage}
            messageType={apiMessageType}
            onMessageClear={() => {
                setApiMessage("");
            }}
        >
            <div
                style={{
                    position:"relative",
                    width:"100%"
                }}
            >
                <div
                    ref={ownerDropdownRef}
                    style={{
                        position:"relative",
                        marginBottom:"12px"
                    }}
                >
                    <button
                        ref={ownerDropdownButtonRef}
                        onClick={toggleOwnerDropdown}
                        style={{
                            width:"150px",
                            padding:"5px",
                            cursor:"pointer"
                        }}
                    >
                        Besitzer auswählen ▼
                    </button>

                    {
                        ownerDropdownOpen &&
                        <div
                            style={{
                                position:"fixed",
                                top:ownerDropdownPosition.top,
                                left:ownerDropdownPosition.left,
                                width:"220px",
                                maxHeight:"450px",
                                overflowY:"auto",
                                background:"#102544",
                                border:"1px solid #ffffff33",
                                padding:"8px",
                                zIndex:100000,
                                boxSizing:"border-box",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.5)"
                            }}
                        >
                            <div
                                style={{
                                    display:"flex",
                                    gap:"6px",
                                    marginBottom:"8px",
                                    paddingBottom:"8px",
                                    borderBottom:
                                        "1px solid #ffffff33"
                                }}
                            >
                                <button
                                    onClick={
                                        selectAllOwners
                                    }
                                >
                                    Alle auswählen
                                </button>

                                <button
                                    onClick={
                                        deselectAllOwners
                                    }
                                >
                                    Alles abwählen
                                </button>
                            </div>

                            {
                                owners.map(
                                    owner => (
                                        <label
                                            key={
                                                owner.id
                                            }
                                            style={{
                                                display:"flex",
                                                alignItems:"center",
                                                gap:"6px",
                                                marginBottom:"4px"
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    filteredOwnerIds.includes(
                                                        owner.id
                                                    )
                                                }
                                                onChange={() => {
                                                    toggleOwner(
                                                        owner.id
                                                    );
                                                }}
                                            />

                                            <span
                                                style={{
                                                    width:"12px",
                                                    height:"12px",
                                                    borderRadius:"50%",
                                                    background:
                                                        owner.color,
                                                    flexShrink:0
                                                }}
                                            />

                                            {owner.name}
                                        </label>
                                    )
                                )
                            }
                        </div>
                    }
                </div>

                <div
                    style={{
                        overflowX:"auto",
                        overflowY:"auto",
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
                            <col
                                style={{
                                    width:"140px"
                                }}
                            />

                            <col
                                style={{
                                    width:"100px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"75px"
                                }}
                            />

                            <col
                                style={{
                                    width:"110px"
                                }}
                            />

                            <col
                                style={{
                                    width:"140px"
                                }}
                            />

                            <col
                                style={{
                                    width:"150px"
                                }}
                            />
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
                                filteredOwners.map(
                                    owner => {
                                        const fleet =
                                            fleets[
                                                owner.id
                                            ];

                                        if(!fleet){
                                            return null;
                                        }

                                        const isEditing =
                                            editingOwnerId ===
                                            owner.id;

                                        const damage =
                                            calculateFleetDamage(
                                                fleet,
                                                owner.volk
                                            );

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
                                            <Fragment
                                                key={
                                                    owner.id
                                                }
                                            >
                                                <tr>
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
                                                        {
                                                            fleet.T1.toLocaleString(
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
                                                        {
                                                            fleet.T2.toLocaleString(
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
                                                        {
                                                            fleet.T3.toLocaleString(
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
                                                        {
                                                            fleet.S1.toLocaleString(
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
                                                        {
                                                            fleet.S2.toLocaleString(
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
                                                        {
                                                            fleet.S3.toLocaleString(
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
                                                                }
                                                                else{
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
                                                    isEditing &&
                                                    editedFleet &&
                                                    editedDamage &&
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding:"8px",
                                                                borderTop:
                                                                    "1px solid #ffffff22"
                                                            }}
                                                        />

                                                        <td
                                                            style={{
                                                                padding:"8px",
                                                                borderTop:
                                                                    "1px solid #ffffff22"
                                                            }}
                                                        />

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
                                            </Fragment>
                                        );
                                    }
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Panel>
    );
}