import { useEffect, useState } from "react";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import type { Planet } from "../../../types/planet";
import { Trash2 } from "lucide-react";
import { xyzToAddress, addressToXYZ, isValidAddress } from "../../../utils/address";

export default function PlanetInfo() {
    const planet = usePlanetStore(
        state => state.selectedPlanet
    );

    const updatePlanet = usePlanetStore(
        state => state.updatePlanet
    );

    const copyPlanet = usePlanetStore(
        state => state.copyPlanet
    );

    const deletePlanet = usePlanetStore(
        state => state.deletePlanet
    );

    const clearSelection = usePlanetStore(
        state => state.clearSelection
    );

    const owners = useOwnerStore(
        state => state.owners
    );

    const setPreviewPlanet = usePlanetStore(
        state => state.setPreviewPlanet
    );

    const [editPlanet, setEditPlanet] =
        useState<Planet | null>(null);

    const [addressInput, setAddressInput] =
        useState<string | null>(null);

    const [addressMessage, setAddressMessage] =
        useState("");

    const [saveMessage, setSaveMessage] =
        useState("");

    const [saveMessageType, setSaveMessageType] =
        useState<
            "success" | "error" | "info"
        >("info");

    const [isSaving, setIsSaving] =
        useState(false);

    const [isCopying, setIsCopying] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    useEffect(() => {
        if(!saveMessage){
            return;
        }

        const timer =
            window.setTimeout(() => {
                setSaveMessage("");
            }, 4000);

        return () => {
            window.clearTimeout(
                timer
            );
        };
    }, [
        saveMessage
    ]);

    if(!planet){
        return null;
    }

    const currentPlanet =
        editPlanet ?? {
            ...planet
        };

    const hasChanges =
        editPlanet !== null &&
        (
            editPlanet.name !== planet.name ||
            editPlanet.x !== planet.x ||
            editPlanet.y !== planet.y ||
            editPlanet.z !== planet.z ||
            editPlanet.owner_id !== planet.owner_id
        );

    const isBusy =
        isSaving ||
        isCopying ||
        isDeleting;

    const changePlanet = (
        changes: Partial<Planet>,
        updateAddress = true
    ) => {
        setSaveMessage("");

        const updatedPlanet = {
            ...currentPlanet,
            ...changes
        };

        setEditPlanet(
            updatedPlanet
        );

        setPreviewPlanet(
            updatedPlanet
        );

        if(updateAddress){
            const newAddress =
                xyzToAddress(
                    updatedPlanet.x,
                    updatedPlanet.y,
                    updatedPlanet.z
                );

            setAddressInput(
                newAddress
            );

            if(isValidAddress(newAddress)){
                setAddressMessage(
                    "Adresse gültig"
                );
            }
            else{
                setAddressMessage(
                    "Ungültige Adresse"
                );
            }
        }
    };

    const checkAddress = (
        address: string,
        applyCoordinates = true
    ) => {
        const result =
            addressToXYZ(
                address
            );

        if(!result){
            setAddressMessage(
                "Ungültige Adresse"
            );

            return;
        }

        if(applyCoordinates){
            changePlanet(
                {
                    x: result.x,
                    y: result.y,
                    z: result.z
                },
                false
            );
        }

        if(isValidAddress(address)){
            setAddressMessage(
                "Adresse gültig"
            );
        }
        else{
            setAddressMessage(
                "Ungültige Adresse"
            );
        }
    };

    const handleCancel = () => {
        if(isBusy){
            return;
        }

        setEditPlanet(
            null
        );

        setPreviewPlanet(
            null
        );

        setSaveMessage(
            ""
        );

        setAddressInput(
            null
        );

        setAddressMessage(
            ""
        );

        clearSelection();
    };

    const handleSave = async () => {
        if(isBusy){
            return;
        }

        setIsSaving(
            true
        );

        setSaveMessage(
            ""
        );

        try{
            await updatePlanet(
                currentPlanet.id,
                currentPlanet
            );

            setSaveMessage(
                "✓ Planet gespeichert"
            );

            setSaveMessageType(
                "success"
            );

            setPreviewPlanet(
                null
            );

            setEditPlanet(
                null
            );

            setAddressInput(
                null
            );
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Planet konnte nicht gespeichert werden.";

            setSaveMessage(
                "✕ " + message
            );

            setSaveMessageType(
                "error"
            );
        }
        finally{
            setIsSaving(
                false
            );
        }
    };

    const handleCopy = async () => {
        if(isBusy || !hasChanges){
            return;
        }

        setIsCopying(
            true
        );

        setSaveMessage(
            ""
        );

        try{
            const copiedPlanet =
                await copyPlanet(
                    currentPlanet
                );

            setEditPlanet(
                null
            );

            setPreviewPlanet(
                null
            );

            setAddressInput(
                null
            );

            setAddressMessage(
                ""
            );

            setSaveMessage(
                `✓ ${copiedPlanet.name} erstellt`
            );

            setSaveMessageType(
                "success"
            );
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Planet konnte nicht kopiert werden.";

            setSaveMessage(
                "✕ " + message
            );

            setSaveMessageType(
                "error"
            );
        }
        finally{
            setIsCopying(
                false
            );
        }
    };

    const handleDelete = async () => {
        if(isBusy){
            return;
        }

        const confirmed =
            window.confirm(
                `Möchtest du den Planeten "${currentPlanet.name}" wirklich löschen?`
            );

        if(!confirmed){
            return;
        }

        setIsDeleting(
            true
        );

        setSaveMessage(
            ""
        );

        try{
            await deletePlanet(
                currentPlanet.id
            );

            setEditPlanet(
                null
            );

            setPreviewPlanet(
                null
            );

            setAddressInput(
                null
            );

            setAddressMessage(
                ""
            );

            clearSelection();
        }
        catch(error){
            const message =
                error instanceof Error
                    ? error.message
                    : "Planet konnte nicht gelöscht werden.";

            setSaveMessage(
                "✕ " + message
            );

            setSaveMessageType(
                "error"
            );
        }
        finally{
            setIsDeleting(
                false
            );
        }
    };

    const messageBackground =
        saveMessageType === "success"
            ? "#164d2a"
            : saveMessageType === "error"
                ? "#5a2020"
                : "#18365c";

    const messageColor =
        saveMessageType === "success"
            ? "#9cffb5"
            : saveMessageType === "error"
                ? "#ffaaaa"
                : "#a8cfff";

    return (
            <div
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 100,
                    width: "260px"
                }}
            >
                <div
                    style={{
                        position: "relative",
                        background: "#102544",
                        color: "white",
                        padding: "15px",
                        width: "230px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.5)"
                    }}
                >
                <h3>
                    Planet bearbeiten
                </h3>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        Name:
                    </label>

                    <input
                        style={{
                            flex: 1
                        }}
                        value={
                            currentPlanet.name
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                changePlanet({
                                    name:
                                        event.target.value
                                });
                            }
                        }
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        Adresse:
                    </label>

                    <input
                        style={{
                            width: "110px"
                        }}
                        value={
                            addressInput ??
                            xyzToAddress(
                                currentPlanet.x,
                                currentPlanet.y,
                                currentPlanet.z
                            )
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                setAddressInput(
                                    event.target.value
                                );

                                setAddressMessage(
                                    "Ungeprüft"
                                );
                            }
                        }
                    />

                    <button
                        style={{
                            marginLeft: "4px",
                            padding: "3px 3px"
                        }}
                        disabled={isBusy}
                        onClick={() => {
                            const currentAddress =
                                addressInput ??
                                xyzToAddress(
                                    currentPlanet.x,
                                    currentPlanet.y,
                                    currentPlanet.z
                                );

                            checkAddress(
                                currentAddress
                            );
                        }}
                    >
                        Prüfen
                    </button>
                </div>

                <div
                    style={{
                        height: "20px",
                        marginBottom: "10px",
                        fontSize: "14px",
                        color:
                            addressMessage === "Ungültige Adresse"
                                ? "#ff8080"
                                : addressMessage === "Adresse gültig"
                                    ? "#80ff80"
                                    : "#ffaa40"
                    }}
                >
                    {
                        addressMessage
                            ? addressMessage
                            : "Ungeprüft"
                    }
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        X:
                    </label>

                    <input
                        style={{
                            flex: 1
                        }}
                        type="number"
                        value={
                            currentPlanet.x
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                changePlanet({
                                    x: Number(
                                        event.target.value
                                    )
                                });
                            }
                        }
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        Y:
                    </label>

                    <input
                        style={{
                            flex: 1
                        }}
                        type="number"
                        value={
                            currentPlanet.y
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                changePlanet({
                                    y: Number(
                                        event.target.value
                                    )
                                });
                            }
                        }
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        Z:
                    </label>

                    <input
                        style={{
                            flex: 1
                        }}
                        type="number"
                        value={
                            currentPlanet.z
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                changePlanet({
                                    z: Number(
                                        event.target.value
                                    )
                                });
                            }
                        }
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label
                        style={{
                            width: "60px"
                        }}
                    >
                        Besitzer:
                    </label>

                    <select
                        style={{
                            flex: 1
                        }}
                        value={
                            currentPlanet.owner_id
                        }
                        disabled={isBusy}
                        onChange={
                            event => {
                                changePlanet({
                                    owner_id:
                                        event.target.value
                                });
                            }
                        }
                    >
                        {
                            owners.map(
                                owner => (
                                    <option
                                        key={
                                            owner.id
                                        }
                                        value={
                                            owner.id
                                        }
                                    >
                                        {owner.name}
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
                        marginTop: "15px"
                    }}
                >
                    <button
                        disabled={
                            isBusy ||
                            !hasChanges
                        }
                        onClick={
                            handleCopy
                        }
                        style={{
                            width: "75px"
                        }}
                    >
                        {
                            isCopying
                                ? "Kopieren..."
                                : "Kopieren"
                        }
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "10px",
                        marginTop: "8px"
                    }}
                >
                    <button
                        disabled={isBusy}
                        onClick={
                            handleDelete
                        }
                        style={{
                            padding: 2,
                            background: "#a81b1b",
                            color: "white"
                        }}
                    >
                        <Trash2 size={16}/>
                    </button>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "flex-start"
                        }}
                    >
                        <button
                            disabled={isBusy}
                            onClick={
                                handleCancel
                            }
                            style={{
                                width: "75px"
                            }}
                        >
                            Abbrechen
                        </button>

                        <button
                            disabled={isBusy}
                            onClick={
                                handleSave
                            }
                            style={{
                                width: "75px"
                            }}
                        >
                            {
                                isSaving
                                    ? "Speichern..."
                                    : "Speichern"
                            }
                        </button>
                    </div>
                </div>
            </div>

            {
                saveMessage &&
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        left: 0,
                        width: "100%",
                        background:
                            messageBackground,
                        color:
                            messageColor,
                        padding: "10px 15px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.5)",
                        boxSizing: "border-box",
                        fontSize: "13px"
                    }}
                >
                    {saveMessage}
                </div>
            }
        </div>
    );
}