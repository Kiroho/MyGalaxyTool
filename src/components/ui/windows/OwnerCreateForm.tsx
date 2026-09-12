import { useState } from "react";
import { useOwnerStore } from "../../../store/ownerStore";
import { volkList, type Volk } from "../../../types/owner";

type Props = {
    onClose: () => void;
    onMessage?: (
        message: string,
        type: "success" | "error" | "info"
    ) => void;
};

export default function OwnerCreateForm({
    onClose,
    onMessage
}: Props){
    const addOwner = useOwnerStore(
        state => state.addOwner
    );

    const [name,setName] =
        useState("");

    const [color,setColor] =
        useState("#ffffff");

    const [volk,setVolk] =
        useState<Volk>("Tau'ri");

    const [isSaving,setIsSaving] =
        useState(false);

    const handleSave = async () => {
        if(!name.trim() || isSaving){
            return;
        }

        setIsSaving(true);

        try{
            const createdOwner =
                await addOwner({
                    id: crypto.randomUUID(),
                    name: name.trim(),
                    color,
                    volk
                });

            onMessage?.(
                `✓ ${createdOwner.name} erstellt`,
                "success"
            );

            onClose();
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Besitzer konnte nicht erstellt werden.";

            onMessage?.(
                "✕ " + message,
                "error"
            );
        }
        finally{
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h4
                style={{
                    marginBottom: "15px"
                }}
            >
                Besitzer hinzufügen
            </h4>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px"
                }}
            >
                <label
                    style={{
                        width: "80px"
                    }}
                >
                    Name:
                </label>

                <input
                    style={{
                        flex: 1,
                        padding: "5px"
                    }}
                    value={name}
                    disabled={isSaving}
                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }
                />
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <label
                    style={{
                        width: "80px"
                    }}
                >
                    Farbe:
                </label>

                <input
                    type="color"
                    value={color}
                    disabled={isSaving}
                    onChange={(event) =>
                        setColor(
                            event.target.value
                        )
                    }
                />

                <span
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    {color}
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >
                <label
                    style={{
                        width: "80px"
                    }}
                >
                    Volk:
                </label>

                <select
                    style={{
                        flex: 1,
                        padding: "5px"
                    }}
                    value={volk}
                    disabled={isSaving}
                    onChange={(event) => {
                        setVolk(
                            event.target.value as Volk
                        );
                    }}
                >
                    {
                        volkList.map(
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
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px"
                }}
            >
                <button
                    disabled={isSaving}
                    onClick={onClose}
                >
                    Abbrechen
                </button>

                <button
                    disabled={
                        isSaving ||
                        !name.trim()
                    }
                    onClick={handleSave}
                >
                    {
                        isSaving
                            ? "Speichern..."
                            : "Speichern"
                    }
                </button>
            </div>
        </div>
    );
}