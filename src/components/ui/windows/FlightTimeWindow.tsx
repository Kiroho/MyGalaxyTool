import { useEffect, useMemo, useRef, useState } from "react";
import Panel from "../Panel";
import { useUIStore } from "../../../store/uiStore";
import InputTabs from "./InputTabs";
import type { InputMode } from "./InputTabs";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { addressToXYZ } from "../../../utils/address";
import XYZDisplay from "./XYZDisplay";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

export default function FlightTimeWindow({
    onFocus,
    zIndex
}: Props) {
    const COORDINATE_TO_LY = 12;

    const flightTimeWindowOpen = useUIStore(
        state => state.flightTimeWindow.open
    );

    const closeFlightTimeWindow = useUIStore(
        state => state.closeFlightTimeWindow
    );

    const planets = usePlanetStore(
        state => state.planets
    );

    const owners = useOwnerStore(
        state => state.owners
    );

    const [startMode, setStartMode] =
        useState<InputMode>("address");

    const [targetMode, setTargetMode] =
        useState<InputMode>("address");

    const [startAddress, setStartAddress] =
        useState("");

    const [targetAddress, setTargetAddress] =
        useState("");

    const [startPoint, setStartPoint] =
        useState<{
            x: number | "";
            y: number | "";
            z: number | "";
        }>({
            x: "",
            y: "",
            z: ""
        });

    const [targetPoint, setTargetPoint] =
        useState<{
            x: number | "";
            y: number | "";
            z: number | "";
        }>({
            x: "",
            y: "",
            z: ""
        });

    const [startPlanetId, setStartPlanetId] =
        useState("");

    const [targetPlanetId, setTargetPlanetId] =
        useState("");

    const [startPlanetDropdownOpen, setStartPlanetDropdownOpen] =
        useState(false);

    const [targetPlanetDropdownOpen, setTargetPlanetDropdownOpen] =
        useState(false);

    const [startKeyboardIndex, setStartKeyboardIndex] =
        useState(-1);

    const [targetKeyboardIndex, setTargetKeyboardIndex] =
        useState(-1);

    const [speed, setSpeed] =
        useState<number | "">("");

    const [distance, setDistance] =
        useState<number | null>(null);

    const [flightTime, setFlightTime] =
        useState("");

    const lastStartSearchKey =
        useRef("");

    const lastStartSearchIndex =
        useRef(-1);

    const lastTargetSearchKey =
        useRef("");

    const lastTargetSearchIndex =
        useRef(-1);

    const startPlanetDropdownRef =
        useRef<HTMLDivElement>(null);

    const targetPlanetDropdownRef =
        useRef<HTMLDivElement>(null);

    const startPlanetOptionRefs =
        useRef<Record<string, HTMLDivElement | null>>({});

    const targetPlanetOptionRefs =
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

    const updateAddressPoint = (
        point: "start" | "target",
        address: string
    ) => {
        const xyz =
            addressToXYZ(address);

        if(!xyz){
            return;
        }

        if(point === "start"){
            setStartPoint({
                x: xyz.x,
                y: xyz.y,
                z: xyz.z
            });
        }else{
            setTargetPoint({
                x: xyz.x,
                y: xyz.y,
                z: xyz.z
            });
        }
    };

    const updatePoint = (
        point: "start" | "target",
        axis: "x" | "y" | "z",
        value: number | ""
    ) => {
        if(point === "start"){
            setStartPoint(prev => ({
                ...prev,
                [axis]: value
            }));
        }else{
            setTargetPoint(prev => ({
                ...prev,
                [axis]: value
            }));
        }
    };

    const selectPlanetPoint = (
        point: "start" | "target",
        planetId: string
    ) => {
        const planet =
            planets.find(
                planet =>
                    planet.id ===
                    planetId
            );

        if(!planet){
            return;
        }

        if(point === "start"){
            setStartPlanetId(
                planet.id
            );

            setStartPoint({
                x: planet.x,
                y: planet.y,
                z: planet.z
            });
        }else{
            setTargetPlanetId(
                planet.id
            );

            setTargetPoint({
                x: planet.x,
                y: planet.y,
                z: planet.z
            });
        }
    };

    const resetStartKeyboardSearch = () => {
        lastStartSearchKey.current =
            "";

        lastStartSearchIndex.current =
            -1;
    };

    const resetTargetKeyboardSearch = () => {
        lastTargetSearchKey.current =
            "";

        lastTargetSearchIndex.current =
            -1;
    };

    const closeStartDropdown = () => {
        setStartPlanetDropdownOpen(
            false
        );

        setStartKeyboardIndex(
            -1
        );

        resetStartKeyboardSearch();
    };

    const closeTargetDropdown = () => {
        setTargetPlanetDropdownOpen(
            false
        );

        setTargetKeyboardIndex(
            -1
        );

        resetTargetKeyboardSearch();
    };

    const confirmStartKeyboardSelection = () => {
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

        selectPlanetPoint(
            "start",
            planet.id
        );

        closeStartDropdown();
    };

    const confirmTargetKeyboardSelection = () => {
        if(
            targetKeyboardIndex < 0 ||
            targetKeyboardIndex >=
                sortedPlanets.length
        ){
            return;
        }

        const planet =
            sortedPlanets[
                targetKeyboardIndex
            ];

        selectPlanetPoint(
            "target",
            planet.id
        );

        closeTargetDropdown();
    };

    const handleStartPlanetKeyDown = (
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

            resetStartKeyboardSearch();

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

            resetStartKeyboardSearch();

            return;
        }

        if(event.key === "Enter"){
            event.preventDefault();

            confirmStartKeyboardSelection();

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
            lastStartSearchKey.current ===
            searchKey
        ){
            nextIndex =
                (
                    lastStartSearchIndex.current +
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

        lastStartSearchKey.current =
            searchKey;

        lastStartSearchIndex.current =
            nextIndex;
    };

    const handleTargetPlanetKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if(
            sortedPlanets.length === 0
        ){
            return;
        }

        if(event.key === "ArrowDown"){
            event.preventDefault();

            setTargetKeyboardIndex(
                prev =>
                    prev < 0
                        ? 0
                        : (
                            prev + 1
                        ) %
                        sortedPlanets.length
            );

            resetTargetKeyboardSearch();

            return;
        }

        if(event.key === "ArrowUp"){
            event.preventDefault();

            setTargetKeyboardIndex(
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

            resetTargetKeyboardSearch();

            return;
        }

        if(event.key === "Enter"){
            event.preventDefault();

            confirmTargetKeyboardSelection();

            return;
        }

        if(event.key === "Escape"){
            event.preventDefault();

            closeTargetDropdown();

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
            lastTargetSearchKey.current ===
            searchKey
        ){
            nextIndex =
                (
                    lastTargetSearchIndex.current +
                    1
                ) %
                matchingIndices.length;
        }

        const matchingItem =
            matchingIndices[
                nextIndex
            ];

        setTargetKeyboardIndex(
            matchingItem.index
        );

        lastTargetSearchKey.current =
            searchKey;

        lastTargetSearchIndex.current =
            nextIndex;
    };

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

    useEffect(() => {
        if(
            targetKeyboardIndex < 0 ||
            targetKeyboardIndex >=
                sortedPlanets.length
        ){
            return;
        }

        const planet =
            sortedPlanets[
                targetKeyboardIndex
            ];

        targetPlanetOptionRefs.current[
            planet.id
        ]?.scrollIntoView({
            block: "nearest"
        });
    }, [
        targetKeyboardIndex,
        sortedPlanets
    ]);

    const calculate = () => {
        if(
            startPoint.x === "" ||
            startPoint.y === "" ||
            startPoint.z === "" ||
            targetPoint.x === "" ||
            targetPoint.y === "" ||
            targetPoint.z === ""
        ){
            return;
        }

        const dx =
            targetPoint.x - startPoint.x;

        const dy =
            targetPoint.y - startPoint.y;

        const dz =
            targetPoint.z - startPoint.z;

        const coordinateDistance =
            Math.sqrt(
                dx * dx +
                dy * dy +
                dz * dz
            );

        const lightyearDistance =
            coordinateDistance *
            COORDINATE_TO_LY;

        setDistance(
            lightyearDistance
        );

        if(
            speed === "" ||
            speed <= 0
        ){
            setFlightTime("");

            return;
        }

        const totalSeconds =
            Math.floor(
                lightyearDistance *
                speed
            );

        const hours =
            Math.floor(
                totalSeconds / 3600
            );

        const minutes =
            Math.floor(
                (
                    totalSeconds %
                    3600
                ) / 60
            );

        const seconds =
            totalSeconds %
            60;

        setFlightTime(
            `${hours
                .toString()
                .padStart(2, "0")
            }:${
                minutes
                    .toString()
                    .padStart(2, "0")
            }:${
                seconds
                    .toString()
                    .padStart(2, "0")
            }`
        );
    };

    const renderXYZInput = (
        point: "start" | "target"
    ) => {
        const values =
            point === "start"
                ? startPoint
                : targetPoint;

        return (
            <div
                style={{
                    display:
                        "flex",
                    gap:
                        "10px",
                    marginTop:
                        "20px",
                    marginBottom:
                        "40px"
                }}
            >
                {
                    (
                        [
                            "x",
                            "y",
                            "z"
                        ] as const
                    ).map(
                        axis => (
                            <div
                                key={
                                    axis
                                }
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap:
                                        "5px"
                                }}
                            >
                                <label>
                                    {
                                        axis.toUpperCase()
                                    }:
                                </label>

                                <input
                                    type="number"
                                    placeholder={
                                        point ===
                                        "start"
                                            ? "100"
                                            : "200"
                                    }
                                    style={{
                                        width:
                                            "80px"
                                    }}
                                    value={
                                        values[
                                            axis
                                        ]
                                    }
                                    onChange={
                                        event => {
                                            updatePoint(
                                                point,
                                                axis,
                                                event
                                                    .target
                                                    .value ===
                                                    ""
                                                    ? ""
                                                    : Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            );
                                        }
                                    }
                                />
                            </div>
                        )
                    )
                }
            </div>
        );
    };

    if(!flightTimeWindowOpen){
        return null;
    }

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

    const selectedTargetPlanet =
        planets.find(
            planet =>
                planet.id ===
                targetPlanetId
        );

    const selectedTargetPlanetOwner =
        owners.find(
            owner =>
                owner.id ===
                selectedTargetPlanet?.owner_id
        );

    const resultExtension =
        distance !== null && (
            <div
                style={{
                    display:
                        "flex",
                    flexDirection:
                        "column",
                    gap:
                        "10px"
                }}
            >
                <div>
                    Entfernung:
                    <strong>
                        {" "}
                        {
                            distance.toFixed(
                                2
                            )
                        }{" "}
                        lj
                    </strong>
                </div>

                {
                    flightTime &&
                    (
                        <div>
                            Flugzeit:
                            <strong>
                                {" "}
                                {
                                    flightTime
                                }{" "}
                                h
                            </strong>
                        </div>
                    )
                }
            </div>
        );

    return (
        <Panel
            title="Flugzeitrechner"
            width={400}
            defaultHeight={500}
            initialX={700}
            initialY={100}
            onClose={
                closeFlightTimeWindow
            }
            onFocus={onFocus}
            zIndex={zIndex}
            extension={
                resultExtension
            }
            overflowVisible
        >
            <h4
                style={{
                    marginBottom:
                        "5px"
                }}
            >
                Startpunkt
            </h4>

            <InputTabs
                value={
                    startMode
                }
                onChange={
                    setStartMode
                }
            />

            {
                startMode === "xyz" &&
                renderXYZInput(
                    "start"
                )
            }

            {
                startMode === "address" &&
                (
                    <div
                        style={{
                            marginTop:
                                "20px",
                            marginBottom:
                                "40px"
                        }}
                    >
                        <input
                            placeholder="Adresse eingeben"
                            value={
                                startAddress
                            }
                            onChange={
                                event => {
                                    const value =
                                        event
                                            .target
                                            .value;

                                    setStartAddress(
                                        value
                                    );

                                    updateAddressPoint(
                                        "start",
                                        value
                                    );
                                }
                            }
                        />

                        <XYZDisplay
                            x={
                                startPoint.x
                            }
                            y={
                                startPoint.y
                            }
                            z={
                                startPoint.z
                            }
                        />
                    </div>
                )
            }

            {
                startMode === "planet" &&
                (
                    <div
                        style={{
                            marginTop:
                                "20px",
                            marginBottom:
                                "40px"
                        }}
                    >
                        <div
                            style={{
                                position:
                                    "relative",
                                width:
                                    "200px"
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

                                    resetStartKeyboardSearch();

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
                                (
                                    <div
                                        ref={
                                            startPlanetDropdownRef
                                        }
                                        tabIndex={
                                            0
                                        }
                                        onKeyDown={
                                            handleStartPlanetKeyDown
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
                                                                selectPlanetPoint(
                                                                    "start",
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
                                )
                            }
                        </div>

                        <XYZDisplay
                            x={
                                startPoint.x
                            }
                            y={
                                startPoint.y
                            }
                            z={
                                startPoint.z
                            }
                        />
                    </div>
                )
            }

            <h4
                style={{
                    marginBottom:
                        "5px"
                }}
            >
                Zielpunkt
            </h4>

            <InputTabs
                value={
                    targetMode
                }
                onChange={
                    setTargetMode
                }
            />

            {
                targetMode === "xyz" &&
                renderXYZInput(
                    "target"
                )
            }

            {
                targetMode === "address" &&
                (
                    <div
                        style={{
                            marginTop:
                                "20px",
                            marginBottom:
                                "40px"
                        }}
                    >
                        <input
                            placeholder="Adresse eingeben"
                            value={
                                targetAddress
                            }
                            onChange={
                                event => {
                                    const value =
                                        event
                                            .target
                                            .value;

                                    setTargetAddress(
                                        value
                                    );

                                    updateAddressPoint(
                                        "target",
                                        value
                                    );
                                }
                            }
                        />

                        <XYZDisplay
                            x={
                                targetPoint.x
                            }
                            y={
                                targetPoint.y
                            }
                            z={
                                targetPoint.z
                            }
                        />
                    </div>
                )
            }

            {
                targetMode === "planet" &&
                (
                    <div
                        style={{
                            marginTop:
                                "20px",
                            marginBottom:
                                "40px"
                        }}
                    >
                        <div
                            style={{
                                position:
                                    "relative",
                                width:
                                    "200px"
                            }}
                        >
                            <button
                                onClick={() => {
                                    if(
                                        targetPlanetDropdownOpen
                                    ){
                                        closeTargetDropdown();

                                        return;
                                    }

                                    setTargetKeyboardIndex(
                                        -1
                                    );

                                    resetTargetKeyboardSearch();

                                    setTargetPlanetDropdownOpen(
                                        true
                                    );

                                    window.setTimeout(
                                        () => {
                                            targetPlanetDropdownRef.current?.focus();
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
                                    selectedTargetPlanet
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
                                                            selectedTargetPlanetOwner?.color ??
                                                            "white",
                                                        flexShrink:
                                                            0
                                                    }}
                                                />

                                                {
                                                    selectedTargetPlanet.name
                                                }
                                            </span>
                                        )
                                        : "Planet auswählen"
                                }
                            </button>

                            {
                                targetPlanetDropdownOpen &&
                                (
                                    <div
                                        ref={
                                            targetPlanetDropdownRef
                                        }
                                        tabIndex={
                                            0
                                        }
                                        onKeyDown={
                                            handleTargetPlanetKeyDown
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
                                                                    targetPlanetOptionRefs.current[
                                                                        planet.id
                                                                    ] =
                                                                        element;
                                                                }
                                                            }
                                                            onClick={() => {
                                                                selectPlanetPoint(
                                                                    "target",
                                                                    planet.id
                                                                );

                                                                closeTargetDropdown();
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
                                                                    targetKeyboardIndex ===
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
                                )
                            }
                        </div>

                        <XYZDisplay
                            x={
                                targetPoint.x
                            }
                            y={
                                targetPoint.y
                            }
                            z={
                                targetPoint.z
                            }
                        />
                    </div>
                )
            }

            <hr />

            <div
                style={{
                    display:
                        "flex",
                    alignItems:
                        "center",
                    gap:
                        "10px",
                    marginTop:
                        "15px"
                }}
            >
                <label>
                    Geschwindigkeit:
                </label>

                <input
                    style={{
                        width:
                            "50px"
                    }}
                    type="number"
                    placeholder="1.23"
                    step="0.01"
                    value={
                        speed
                    }
                    onChange={
                        event => {
                            setSpeed(
                                event
                                    .target
                                    .value ===
                                    ""
                                    ? ""
                                    : Number(
                                        event
                                            .target
                                            .value
                                    )
                            );
                        }
                    }
                />

                <label>
                    s/lj
                </label>

                <button
                    style={{
                        marginLeft:
                            "20px"
                    }}
                    onClick={
                        calculate
                    }
                >
                    Berechnen
                </button>
            </div>
        </Panel>
    );
}