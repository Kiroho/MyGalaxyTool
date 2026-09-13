import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import { usePlanetStore } from "../../../store/planetStore";
import OwnerEditForm from "./OwnerEditForm";
import OwnerCreateForm from "./OwnerCreateForm";
import { useEffect, useState } from "react";
import Panel from "../Panel";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

type SortField =
    | "name"
    | "volk"
    | "planets";

type SortDirection =
    | "asc"
    | "desc";

export default function OwnerWindow({
    onFocus,
    zIndex
}: Props) {
    const ownerWindowOpen = useUIStore(
        state => state.ownerWindow.open
    );

    const closeOwnerWindow = useUIStore(
        state => state.closeOwnerWindow
    );

    const owners = useOwnerStore(
        state => state.owners
    );

    const deleteOwner = useOwnerStore(
        state => state.deleteOwner
    );

    const planets = usePlanetStore(
        state => state.planets
    );

    const [editingOwnerId,setEditingOwnerId] =
        useState<string | null>(null);

    const [createMode,setCreateMode] =
        useState(false);

    const [deleteConfirmId,setDeleteConfirmId] =
        useState<string | null>(null);

    const [apiMessage,setApiMessage] =
        useState("");

    const [apiMessageType,setApiMessageType] =
        useState<"success" | "error" | "info">("info");

    const [sortField,setSortField] =
        useState<SortField>(() => {
            const stored =
                localStorage.getItem(
                    "galaxy_owner_sort_field"
                );

            if(
                stored === "name" ||
                stored === "volk" ||
                stored === "planets"
            ){
                return stored;
            }

            return "name";
        });

    const [sortDirection,setSortDirection] =
        useState<SortDirection>(() => {
            const stored =
                localStorage.getItem(
                    "galaxy_owner_sort_direction"
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
            "galaxy_owner_sort_field",
            sortField
        );
    }, [sortField]);

    useEffect(() => {
        localStorage.setItem(
            "galaxy_owner_sort_direction",
            sortDirection
        );
    }, [sortDirection]);

    if(!ownerWindowOpen){
        return null;
    }

    const getPlanetCount = (
        ownerId: string
    ) => {
        return planets.filter(
            planet =>
                planet.owner_id === ownerId
        ).length;
    };

    const sortedOwners = [
        ...owners
    ].sort((a,b) => {
        let comparison = 0;

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

        if(
            sortField === "volk"
        ){
            comparison =
                a.volk.localeCompare(
                    b.volk,
                    "de",
                    {
                        sensitivity: "base"
                    }
                );
        }

        if(
            sortField === "planets"
        ){
            comparison =
                getPlanetCount(a.id)
                -
                getPlanetCount(b.id);
        }

        return sortDirection === "asc"
            ? comparison
            : -comparison;
    });

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

    const handleDelete = async (
        ownerId: string
    ) => {
        try{
            await deleteOwner(ownerId);

            setApiMessage(
                "✓ Besitzer gelöscht"
            );

            setApiMessageType(
                "success"
            );

            setDeleteConfirmId(null);
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Besitzer konnte nicht gelöscht werden.";

            setApiMessage(
                "✕ " + message
            );

            setApiMessageType(
                "error"
            );
        }
    };

    const ownerExtension =
        createMode ? (
            <OwnerCreateForm
                onClose={() => {
                    setCreateMode(false);
                }}
                onMessage={(
                    message,
                    type
                ) => {
                    setApiMessage(message);
                    setApiMessageType(type);
                }}
            />
        ) : editingOwnerId ? (
            <OwnerEditForm
                key={editingOwnerId}
                owner={
                    owners.find(
                        owner =>
                            owner.id === editingOwnerId
                    )!
                }
                onClose={() => {
                    setEditingOwnerId(null);
                }}
                onMessage={(
                    message,
                    type
                ) => {
                    setApiMessage(message);
                    setApiMessageType(type);
                }}
            />
        ) : null;

    return (
        <div
            onClick={event => {
                event.stopPropagation();
            }}
        >
            <Panel
                title="Besitzerverwaltung"
                width={480}
                minHeight={200}
                defaultHeight={550}
                initialX={100}
                initialY={50}
                onClose={closeOwnerWindow}
                onFocus={onFocus}
                zIndex={zIndex}
                message={apiMessage}
                messageType={apiMessageType}
                extension={ownerExtension}
                onMessageClear={() => {
                    setApiMessage("");
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >
                    <button
                        onClick={() => {
                            setCreateMode(true);
                            setEditingOwnerId(null);
                            setDeleteConfirmId(null);
                            setApiMessage("");
                        }}
                        style={{
                            cursor: "pointer",
                            width: "28px",
                            height: "28px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box"
                        }}
                    >
                        <Plus size={18} />
                    </button>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginRight: "8px"
                        }}
                    >
                        <select
                            value={sortField}
                            onChange={event => {
                                handleSortFieldChange(
                                    event.target.value as SortField
                                );
                            }}
                            style={{
                                height: "28px",
                                padding: "0 8px",
                                boxSizing: "border-box"
                            }}
                        >
                            <option value="name">
                                Name
                            </option>

                            <option value="volk">
                                Volk
                            </option>

                            <option value="planets">
                                Planeten
                            </option>
                        </select>

                        <button
                            onClick={() => {
                                setSortDirection(
                                    direction =>
                                        direction === "asc"
                                            ? "desc"
                                            : "asc"
                                );
                            }}
                            style={{
                                cursor: "pointer",
                                width: "28px",
                                height: "28px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxSizing: "border-box"
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

                <hr />

                <div>
                    {
                        sortedOwners.map(owner => (
                            <div
                                key={owner.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                    marginRight: "10px",
                                    flexWrap: "wrap"
                                }}
                            >
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        background: owner.color,
                                        borderRadius: "50%",
                                        marginRight: "10px"
                                    }}
                                />

                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "120px"
                                        }}
                                    >
                                        {owner.name}
                                    </span>

                                    <span
                                        style={{
                                            width: "90px",
                                            fontSize: "16px",
                                            opacity: 0.8
                                        }}
                                    >
                                        {owner.volk}
                                    </span>

                                    <span
                                        style={{
                                            width: "90px",
                                            fontSize: "16px",
                                            opacity: 0.8
                                        }}
                                    >
                                        {getPlanetCount(
                                            owner.id
                                        )}{" "}
                                        Planeten
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "5px"
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setEditingOwnerId(
                                                owner.id
                                            );

                                            setCreateMode(false);

                                            setDeleteConfirmId(null);

                                            setApiMessage("");
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDeleteConfirmId(
                                                owner.id
                                            );

                                            setEditingOwnerId(null);

                                            setCreateMode(false);

                                            setApiMessage("");
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {
                                    deleteConfirmId === owner.id &&
                                    <div
                                        style={{
                                            width: "100%",
                                            marginTop: "8px",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: "8px"
                                        }}
                                    >
                                        <span
                                            style={{
                                                marginRight: "auto",
                                                fontSize: "16px"
                                            }}
                                        >
                                            Sicher löschen?
                                        </span>

                                        <button
                                            onClick={() => {
                                                handleDelete(
                                                    owner.id
                                                );
                                            }}
                                        >
                                            Löschen
                                        </button>

                                        <button
                                            onClick={() => {
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
                        ))
                    }
                </div>
            </Panel>
        </div>
    );
}