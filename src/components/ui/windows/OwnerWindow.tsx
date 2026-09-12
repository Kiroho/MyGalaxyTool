import { useUIStore } from "../../../store/uiStore";
import { useOwnerStore } from "../../../store/ownerStore";
import OwnerEditForm from "./OwnerEditForm";
import OwnerCreateForm from "./OwnerCreateForm";
import { useState } from "react";
import Panel from "../Panel";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

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

    if(!ownerWindowOpen){
        return null;
    }

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
                        alignItems: "flex-start"
                    }}
                >
                    <div>
                        <button
                            onClick={() => {
                                setCreateMode(true);
                                setEditingOwnerId(null);
                                setDeleteConfirmId(null);
                                setApiMessage("");
                            }}
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <hr />

                <div>
                    {
                        owners.map(owner => (
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
                                                fontSize: "14px"
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