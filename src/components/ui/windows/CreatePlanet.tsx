
import { useState } from "react";
import { useUIStore } from "../../../store/uiStore";
import { usePlanetStore } from "../../../store/planetStore";
import { useOwnerStore } from "../../../store/ownerStore";
import type { Planet } from "../../../types/planet";
import { xyzToAddress, addressToXYZ, isValidAddress } from "../../../utils/address";
import Panel from "../Panel";

const LAST_OWNER_STORAGE_KEY = "galaxytool_last_planet_owner";

type Props = {
    onFocus?: () => void;
    zIndex?: number;
};

export default function CreatePlanet({ onFocus, zIndex }: Props) {
    const createPlanetWindow = useUIStore(state => state.createPlanetWindow);
    const openCreatePlanetWindow = createPlanetWindow.open;
    const presetPosition = createPlanetWindow.presetPosition;
    const openVersion = createPlanetWindow.openVersion;
    const closeCreatePlanetWindow = useUIStore(state => state.closeCreatePlanetWindow);

    const owners = useOwnerStore(state => state.owners);
    const addPlanet = usePlanetStore(state => state.addPlanet);

    const getDefaultOwnerId = () => {
        const savedOwnerId = localStorage.getItem(LAST_OWNER_STORAGE_KEY);

        if (savedOwnerId && owners.some(owner => String(owner.id) === savedOwnerId)) {
            return savedOwnerId;
        }

        return owners[0] ? String(owners[0].id) : "";
    };

    const createEmptyPlanet = (): Planet => ({
        id: crypto.randomUUID(),
        name: "",
        x: presetPosition?.x ?? 1,
        y: presetPosition?.y ?? 1,
        z: presetPosition?.z ?? 1,
        owner_id: getDefaultOwnerId()
    });

    const [planet, setPlanet] = useState<Planet>(createEmptyPlanet);
    const [addressInput, setAddressInput] = useState<string | null>(null);
    const [addressMessage, setAddressMessage] = useState("");
    const [lastOpenVersion, setLastOpenVersion] = useState(openVersion);

    // Formular beim erneuten Öffnen zurücksetzen, ohne useEffect.
    if (lastOpenVersion !== openVersion) {
        setLastOpenVersion(openVersion);
        setPlanet(createEmptyPlanet());
        setAddressInput(null);
        setAddressMessage("");
    } else if (
        owners.length > 0 &&
        !owners.some(owner => String(owner.id) === String(planet.owner_id))
    ) {
        // Ungültige Besitzer-ID durch einen gültigen Standardbesitzer ersetzen.
        setPlanet(prev => ({
            ...prev,
            owner_id: getDefaultOwnerId()
        }));
    }

    const resetPlanet = () => {
        setPlanet(createEmptyPlanet());
        setAddressInput(null);
        setAddressMessage("");
    };

    const changePlanet = (changes: Partial<Planet>, updateAddress = true) => {
        const updatedPlanet = {
            ...planet,
            ...changes
        };

        setPlanet(updatedPlanet);

        if (updateAddress) {
            const newAddress = xyzToAddress(
                updatedPlanet.x,
                updatedPlanet.y,
                updatedPlanet.z
            );

            setAddressInput(newAddress);

            if (isValidAddress(newAddress)) {
                setAddressMessage("Adresse gültig");
            } else {
                setAddressMessage("Ungültige Adresse");
            }
        }
    };

    const checkAddress = (address: string, applyCoordinates = true) => {
        const result = addressToXYZ(address);

        if (!result) {
            setAddressMessage("Ungültige Adresse");
            return;
        }

        if (applyCoordinates) {
            setPlanet(prev => ({
                ...prev,
                x: result.x,
                y: result.y,
                z: result.z
            }));
        }

        if (isValidAddress(address)) {
            setAddressMessage("Adresse gültig");
        } else {
            setAddressMessage("Ungültige Adresse");
        }
    };

    if (!openCreatePlanetWindow) return null;

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <Panel
                title="Planet Erstellen"
                width={300}
                minHeight={200}
                defaultHeight={340}
                initialX={30}
                initialY={100}
                onClose={closeCreatePlanetWindow}
                onFocus={onFocus}
                zIndex={zIndex}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        Name:
                    </label>

                    <input
                        style={{ flex: 1 }}
                        value={planet.name}
                        onChange={(event) => {
                            changePlanet({
                                name: event.target.value
                            });
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        Adresse:
                    </label>

                    <input
                        style={{ width: "110px" }}
                        value={
                            addressInput ??
                            xyzToAddress(planet.x, planet.y, planet.z)
                        }
                        onChange={(event) => {
                            setAddressInput(event.target.value);
                            setAddressMessage("Ungeprüft");
                        }}
                    />

                    <button
                        style={{
                            marginLeft: "4px",
                            padding: "3px 3px"
                        }}
                        onClick={() => {
                            const currentAddress =
                                addressInput ??
                                xyzToAddress(planet.x, planet.y, planet.z);

                            checkAddress(currentAddress);
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
                    {addressMessage || "Ungeprüft"}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        X:
                    </label>

                    <input
                        style={{ flex: 1 }}
                        type="number"
                        value={planet.x}
                        onChange={(event) => {
                            changePlanet({
                                x: Number(event.target.value)
                            });
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        Y:
                    </label>

                    <input
                        style={{ flex: 1 }}
                        type="number"
                        value={planet.y}
                        onChange={(event) => {
                            changePlanet({
                                y: Number(event.target.value)
                            });
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        Z:
                    </label>

                    <input
                        style={{ flex: 1 }}
                        type="number"
                        value={planet.z}
                        onChange={(event) => {
                            changePlanet({
                                z: Number(event.target.value)
                            });
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <label style={{ width: "60px" }}>
                        Besitzer:
                    </label>

                    <select
                        style={{ flex: 1 }}
                        value={String(planet.owner_id)}
                        disabled={owners.length === 0}
                        onChange={(event) => {
                            const ownerId = event.target.value;

                            localStorage.setItem(
                                LAST_OWNER_STORAGE_KEY,
                                ownerId
                            );

                            changePlanet({
                                owner_id: ownerId
                            }, false);
                        }}
                    >
                        {owners.map(owner => (
                            <option
                                key={owner.id}
                                value={String(owner.id)}
                            >
                                {owner.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "15px"
                    }}
                >
                    <button
                        onClick={() => {
                            resetPlanet();
                            closeCreatePlanetWindow();
                        }}
                    >
                        Abbrechen
                    </button>

                    <button
                        disabled={owners.length === 0 || !planet.owner_id}
                        onClick={async () => {
                            try {
                                const planetToCreate: Planet = {
                                    ...planet,
                                    owner_id:
                                        planet.owner_id ||
                                        getDefaultOwnerId()
                                };

                                console.log(
                                    "Planet vor dem Speichern:",
                                    planetToCreate
                                );

                                await addPlanet(planetToCreate);

                                closeCreatePlanetWindow();
                                resetPlanet();
                            } catch (error) {
                                console.error(
                                    "Planet konnte nicht erstellt werden:",
                                    error
                                );
                            }
                        }}
                    >
                        Speichern
                    </button>
                </div>
            </Panel>
        </div>
    );
}
