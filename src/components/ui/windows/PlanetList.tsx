import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { xyzToAddress } from "../../../utils/address";
import { useUIStore } from "../../../store/uiStore";
import { useState, useEffect, useRef } from "react";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Panel from "../Panel";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

type SortField =
    | "owner"
    | "name";

type SortDirection =
    | "asc"
    | "desc";

export default function PlanetList({
    onFocus,
    zIndex
}: Props){

    const planets = usePlanetStore(
        state => state.planets
    );

    const selectPlanet = usePlanetStore(
        state => state.selectPlanet
    );

    const owners = useOwnerStore(
        state => state.owners
    );

    const selectedOwnerIds = useUIStore(
        state => state.selectedOwnerIds
    );

    const setSelectedOwnerIds = useUIStore(
        state => state.setSelectedOwnerIds
    );

    const initializedFilter = useRef(false);

    const [deleteConfirmId, setDeleteConfirmId] =
        useState<string | null>(null);

    const [ownerDropdownOpen, setOwnerDropdownOpen] =
        useState(false);

    const ownerDropdownRef =
        useRef<HTMLDivElement>(null);

    const deletePlanet = usePlanetStore(
        state => state.deletePlanet
    );

    const closePlanetListWindow = useUIStore(
        state => state.closePlanetListWindow
    );

    const planetListOpen = useUIStore(
        state => state.planetListWindow.open
    );

    const knownOwnerIds =
        useRef<string[]>([]);

    const [sortField,setSortField] =
        useState<SortField>(() => {
            const stored =
                localStorage.getItem(
                    "galaxy_planet_sort_field"
                );

            if(
                stored === "owner" ||
                stored === "name"
            ){
                return stored;
            }

            return "owner";
        });

    const [sortDirection,setSortDirection] =
        useState<SortDirection>(() => {
            const stored =
                localStorage.getItem(
                    "galaxy_planet_sort_direction"
                );

            if(
                stored === "asc" ||
                stored === "desc"
            ){
                return stored;
            }

            return "asc";
        });

    useEffect(() => {
        localStorage.setItem(
            "galaxy_planet_sort_field",
            sortField
        );
    }, [sortField]);

    useEffect(() => {
        localStorage.setItem(
            "galaxy_planet_sort_direction",
            sortDirection
        );
    }, [sortDirection]);

    useEffect(()=>{

        if(owners.length === 0){
            return;
        }

        const currentOwnerIds =
            owners.map(
                owner => owner.id
            );

        if(!initializedFilter.current){

            setSelectedOwnerIds(
                currentOwnerIds
            );

            knownOwnerIds.current =
                currentOwnerIds;

            initializedFilter.current = true;

            return;
        }

        const previousOwnerIds =
            knownOwnerIds.current;

        const newOwnerIds =
            currentOwnerIds.filter(
                id =>
                    !previousOwnerIds.includes(id)
            );

        const removedOwnerIds =
            previousOwnerIds.filter(
                id =>
                    !currentOwnerIds.includes(id)
            );

        if(
            newOwnerIds.length > 0 ||
            removedOwnerIds.length > 0
        ){

            setSelectedOwnerIds(
                selectedOwnerIds => {

                    const withoutRemoved =
                        selectedOwnerIds.filter(
                            id =>
                                !removedOwnerIds.includes(id)
                        );

                    const withNew =
                        [
                            ...withoutRemoved,
                            ...newOwnerIds
                        ];

                    return [
                        ...new Set(withNew)
                    ];
                }
            );
        }

        knownOwnerIds.current =
            currentOwnerIds;

    },[
        owners,
        setSelectedOwnerIds
    ]);

    useEffect(()=>{

        const handleClick = (
            event: MouseEvent
        ) => {

            if(
                ownerDropdownRef.current &&
                !ownerDropdownRef.current.contains(
                    event.target as Node
                )
            ){

                setOwnerDropdownOpen(false);

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

    },[]);

    if(!planetListOpen){
        return null;
    }

    const filteredPlanets =
        planets.filter(planet =>
            selectedOwnerIds.includes(
                planet.owner_id
            )
        );

    const sortedPlanets =
        [...filteredPlanets].sort(
            (a,b) => {

                let comparison = 0;

                if(
                    sortField === "owner"
                ){

                    const ownerA =
                        owners.find(
                            owner =>
                                owner.id === a.owner_id
                        );

                    const ownerB =
                        owners.find(
                            owner =>
                                owner.id === b.owner_id
                        );

                    comparison =
                        (
                            ownerA?.name ?? "Unbekannt"
                        ).localeCompare(
                            ownerB?.name ?? "Unbekannt",
                            "de",
                            {
                                sensitivity: "base"
                            }
                        );
                }

                if(
                    sortField === "name"
                ){

                    comparison =
                        a.name.localeCompare(
                            b.name,
                            "de",
                            {
                                sensitivity: "base"
                            }
                        );
                }

                return sortDirection === "asc"
                    ? comparison
                    : -comparison;
            }
        );

    const handleSortFieldChange = (
        field: SortField
    ) => {

        if(
            sortField === field
        ){

            setSortDirection(
                direction =>
                    direction === "asc"
                        ? "desc"
                        : "asc"
            );

            return;
        }

        setSortField(field);
        setSortDirection("asc");
    };

    return (

        <Panel
            title="Planetenliste"
            width={640}
            minHeight={200}
            defaultHeight={790}
            initialX={30}
            initialY={100}
            onClose={closePlanetListWindow}
            onFocus={onFocus}
            zIndex={zIndex}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "15px"
                }}
            >

                <div
                    ref={ownerDropdownRef}
                    style={{
                        position:"relative"
                    }}
                >

                    <button
                        onClick={()=>{
                            setOwnerDropdownOpen(
                                prev => !prev
                            );
                        }}
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
                                position:"absolute",
                                top:"100%",
                                left:0,
                                width:"220px",
                                background:"#102544",
                                border:"1px solid #ffffff33",
                                padding:"8px",
                                zIndex:10
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
                                    onClick={()=>{
                                        setSelectedOwnerIds(
                                            owners.map(
                                                owner =>
                                                    owner.id
                                            )
                                        );
                                    }}
                                >
                                    Alle auswählen
                                </button>

                                <button
                                    onClick={()=>{
                                        setSelectedOwnerIds([]);
                                    }}
                                >
                                    Alles abwählen
                                </button>

                            </div>

                            {
                                owners.map(owner=>(

                                    <label
                                        key={owner.id}
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
                                                selectedOwnerIds.includes(
                                                    owner.id
                                                )
                                            }
                                            onChange={()=>{

                                                setSelectedOwnerIds(
                                                    prev =>
                                                        prev.includes(
                                                            owner.id
                                                        )
                                                        ?
                                                        prev.filter(
                                                            id =>
                                                                id !== owner.id
                                                        )
                                                        :
                                                        [
                                                            ...prev,
                                                            owner.id
                                                        ]
                                                );

                                            }}
                                        />

                                        <span
                                            style={{
                                                width:"12px",
                                                height:"12px",
                                                borderRadius:"50%",
                                                background:
                                                    owner.color
                                            }}
                                        />

                                        {owner.name}

                                    </label>

                                ))
                            }

                        </div>
                    }

                </div>

                <div
                    style={{
                        display:"flex",
                        alignItems:"center",
                        gap:"6px",
                        marginRight:"32px"
                    }}
                >

                    <select
                        value={sortField}
                        onChange={event=>{
                            handleSortFieldChange(
                                event.target.value as SortField
                            );
                        }}
                        style={{
                            width:"80px",
                            padding:"5px",
                            cursor:"pointer",
                            boxSizing:"border-box"
                        }}
                    >

                        <option value="owner">
                            Besitzer
                        </option>

                        <option value="name">
                            Name
                        </option>

                    </select>

                    <button
                        onClick={()=>{
                            setSortDirection(
                                direction =>
                                    direction === "asc"
                                        ? "desc"
                                        : "asc"
                            );
                        }}
                        style={{
                            cursor:"pointer",
                            width:"28px",
                            height:"28px",
                            padding:0,
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            boxSizing:"border-box"
                        }}
                        title={
                            sortDirection === "asc"
                                ? "Aufsteigend"
                                : "Absteigend"
                        }
                    >

                        {
                            sortDirection === "asc"
                                ? <ArrowDown size={18} />
                                : <ArrowUp size={18} />
                        }

                    </button>

                </div>

            </div>

            <div
                style={{
                    maxHeight:"70vh",
                    overflowY:"auto"
                }}
            >

                {
                    sortedPlanets.length === 0 &&
                    <div>
                        Keine Planeten gefunden
                    </div>
                }

                {
                    sortedPlanets.map(
                        planet => (

                            <div
                                key={planet.id}
                                style={{
                                    marginBottom:"10px",
                                    borderBottom:
                                        "1px solid #ffffff22",
                                    paddingBottom:"8px"
                                }}
                            >

                                <div
                                    onClick={()=>{
                                        selectPlanet(planet);
                                    }}
                                    style={{
                                        display:"flex",
                                        alignItems:"center",
                                        cursor:"pointer"
                                    }}
                                >

                                    {
                                        (()=>{

                                            const owner =
                                                owners.find(
                                                    owner =>
                                                        owner.id ===
                                                        planet.owner_id
                                                );

                                            return (

                                                <>

                                                    <span
                                                        style={{
                                                            width:"14px",
                                                            height:"14px",
                                                            borderRadius:"50%",
                                                            background:
                                                                owner?.color ??
                                                                "white",
                                                            marginRight:"8px"
                                                        }}
                                                    />

                                                    <span
                                                        style={{
                                                            width:"100px"
                                                        }}
                                                    >
                                                        {
                                                            owner?.name ??
                                                            "Unbekannt"
                                                        }
                                                    </span>

                                                </>

                                            );

                                        })()
                                    }

                                    <span
                                        style={{
                                            flex:1
                                        }}
                                    >
                                        {planet.name}
                                    </span>

                                    <span
                                        style={{
                                            width:"140px"
                                        }}
                                    >
                                        {
                                            xyzToAddress(
                                                planet.x,
                                                planet.y,
                                                planet.z
                                            )
                                        }
                                    </span>

                                    <span
                                        style={{
                                            width:"120px"
                                        }}
                                    >
                                        {planet.x} / {planet.y} / {planet.z}
                                    </span>

                                    <button
                                        style={{
                                            marginRight:"15px"
                                        }}
                                        onClick={event=>{
                                            event.stopPropagation();

                                            setDeleteConfirmId(
                                                planet.id
                                            );
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                                {
                                    deleteConfirmId ===
                                    planet.id &&
                                    <div
                                        style={{
                                            marginTop:"8px",
                                            display:"flex",
                                            gap:"8px",
                                            justifyContent:"flex-end"
                                        }}
                                    >

                                        <span
                                            style={{
                                                marginRight:"auto"
                                            }}
                                        >
                                            Sicher löschen?
                                        </span>

                                        <button
                                            onClick={()=>{
                                                deletePlanet(
                                                    planet.id
                                                );

                                                setDeleteConfirmId(
                                                    null
                                                );
                                            }}
                                        >
                                            Löschen
                                        </button>

                                        <button
                                            onClick={()=>{
                                                setDeleteConfirmId(
                                                    null
                                                );
                                            }}
                                        >
                                            Abbrechen
                                        </button>

                                    </div>
                                }

                            </div>

                        )
                    )
                }

            </div>

        </Panel>

    );
}