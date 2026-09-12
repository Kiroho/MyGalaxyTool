import { useState } from "react";
import { getUsername, logout } from "../../../utils/auth";
import { updateUsername, updatePassword } from "../../../utils/galaxyAPI";
import { useUIStore } from "../../../store/uiStore";
import Panel from "../Panel";

type Props = {
    onLogout: () => void;
    onFocus?: () => void;
    zIndex?: number;
};

export default function UserSettingsWindow({
    onLogout,
    onFocus,
    zIndex = 1000
}: Props) {
    const open =
        useUIStore(
            state =>
                state.userSettingsWindow.open
        );

    const close =
        useUIStore(
            state =>
                state.closeUserSettingsWindow
        );

    const [username, setUsername] =
        useState(
            getUsername() ?? ""
        );

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [newPasswordRepeat, setNewPasswordRepeat] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [apiMessage, setApiMessage] =
        useState("");

    const [apiMessageType, setApiMessageType] =
        useState<
            "success" | "error" | "info"
        >("info");

    if(!open){
        return null;
    }

    const originalUsername =
        getUsername() ?? "";

    const usernameChanged =
        username
            .trim()
        !==
        originalUsername;

    const passwordEntered =
        newPassword.length > 0
        ||
        newPasswordRepeat.length > 0
        ||
        currentPassword.length > 0;

    const passwordsMatch =
        newPassword ===
        newPasswordRepeat;

    const canSave =
        !saving
        &&
        (
            usernameChanged
            ||
            (
                passwordEntered
                &&
                passwordsMatch
                &&
                currentPassword.length > 0
                &&
                newPassword.length > 0
            )
        );

    const save =
        async () => {
            setApiMessage("");

            const trimmedUsername =
                username
                    .trim()
                    .toLowerCase();

            if(
                passwordEntered
                &&
                !passwordsMatch
            ){
                setApiMessage(
                    "✕ Die neuen Passwörter stimmen nicht überein."
                );

                setApiMessageType(
                    "error"
                );

                return;
            }

            if(
                passwordEntered
                &&
                !currentPassword
            ){
                setApiMessage(
                    "✕ Bitte das aktuelle Passwort eingeben."
                );

                setApiMessageType(
                    "error"
                );

                return;
            }

            if(
                passwordEntered
                &&
                !newPassword
            ){
                setApiMessage(
                    "✕ Bitte ein neues Passwort eingeben."
                );

                setApiMessageType(
                    "error"
                );

                return;
            }

            if(
                passwordEntered
                &&
                newPassword.length < 6
            ){
                setApiMessage(
                    "✕ Das neue Passwort muss mindestens 6 Zeichen lang sein."
                );

                setApiMessageType(
                    "error"
                );

                return;
            }

            setSaving(true);

            try {
                let usernameWasChanged =
                    false;

                let passwordWasChanged =
                    false;

                if(
                    usernameChanged
                ){
                    const result =
                        await updateUsername(
                            trimmedUsername
                        );

                    if(
                        typeof result !== "object"
                        ||
                        result === null
                        ||
                        !("username" in result)
                        ||
                        typeof result.username !== "string"
                    ){
                        throw new Error(
                            "Der Server hat keine gültige Benutzerantwort geliefert."
                        );
                    }

                    localStorage.setItem(
                        "galaxy_username",
                        result.username
                    );

                    setUsername(
                        result.username
                    );

                    usernameWasChanged =
                        true;
                }

                if(
                    passwordEntered
                ){
                    await updatePassword(
                        currentPassword,
                        newPassword
                    );

                    passwordWasChanged =
                        true;
                }

                if(
                    passwordWasChanged
                ){
                    logout();
                    onLogout();
                    close();
                    return;
                }

                setCurrentPassword("");
                setNewPassword("");
                setNewPasswordRepeat("");

                if(
                    usernameWasChanged
                ){
                    setApiMessage(
                        "✓ Benutzername erfolgreich geändert."
                    );

                    setApiMessageType(
                        "success"
                    );
                }

            } catch(error) {
                console.error(
                    "Benutzereinstellungen konnten nicht gespeichert werden:",
                    error
                );

                if(
                    error instanceof Error
                ){
                    setApiMessage(
                        "✕ " + error.message
                    );
                } else {
                    setApiMessage(
                        "✕ Die Änderungen konnten nicht gespeichert werden."
                    );
                }

                setApiMessageType(
                    "error"
                );

            } finally {
                setSaving(false);
            }
        };

    return (
        <Panel
            title="Benutzereinstellungen"
            width={450}
            minHeight={200}
            defaultHeight={475}
            initialX={
                window.innerWidth / 2 - 200
            }
            initialY={100}
            onClose={close}
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
                    marginBottom:"18px"
                }}
            >
                <label>
                    Benutzername
                </label>

                <input
                    type="text"
                    value={username}
                    onChange={
                        event => {
                            setUsername(
                                event.target.value
                            );
                            setApiMessage("");
                        }
                    }
                    style={{
                        width:"100%",
                        boxSizing:"border-box",
                        marginTop:"6px",
                        padding:"8px"
                    }}
                />
            </div>

            <div
                style={{
                    borderTop:
                        "1px solid #ffffff22",
                    paddingTop:"15px",
                    marginTop:"15px"
                }}
            >
                <h3
                    style={{
                        marginTop:0
                    }}
                >
                    Passwort ändern
                </h3>

                <div
                    style={{
                        marginBottom:"12px"
                    }}
                >
                    <label>
                        Aktuelles Passwort
                    </label>

                    <input
                        type="password"
                        value={currentPassword}
                        onChange={
                            event => {
                                setCurrentPassword(
                                    event.target.value
                                );
                                setApiMessage("");
                            }
                        }
                        style={{
                            width:"100%",
                            boxSizing:"border-box",
                            marginTop:"6px",
                            padding:"8px"
                        }}
                    />
                </div>

                <div
                    style={{
                        marginBottom:"12px"
                    }}
                >
                    <label>
                        Neues Passwort
                    </label>

                    <input
                        type="password"
                        value={newPassword}
                        onChange={
                            event => {
                                setNewPassword(
                                    event.target.value
                                );
                                setApiMessage("");
                            }
                        }
                        style={{
                            width:"100%",
                            boxSizing:"border-box",
                            marginTop:"6px",
                            padding:"8px"
                        }}
                    />
                </div>

                <div>
                    <label>
                        Neues Passwort wiederholen
                    </label>

                    <input
                        type="password"
                        value={newPasswordRepeat}
                        onChange={
                            event => {
                                setNewPasswordRepeat(
                                    event.target.value
                                );
                                setApiMessage("");
                            }
                        }
                        style={{
                            width:"100%",
                            boxSizing:"border-box",
                            marginTop:"6px",
                            padding:"8px"
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display:"flex",
                    justifyContent:"flex-end",
                    gap:"8px",
                    marginTop:"25px"
                }}
            >
                <button
                    onClick={close}
                    disabled={saving}
                >
                    Abbrechen
                </button>

                <button
                    onClick={save}
                    disabled={!canSave}
                >
                    {
                        saving
                        ?
                        "Speichern..."
                        :
                        "Speichern"
                    }
                </button>
            </div>
        </Panel>
    );
}