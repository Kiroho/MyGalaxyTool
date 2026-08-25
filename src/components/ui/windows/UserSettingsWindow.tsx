import { useState } from "react";
import { getUsername, logout } from "../../../utils/auth";
import { updateUsername, updatePassword } from "../../../utils/galaxyAPI";
import { useUIStore } from "../../../store/uiStore";
import Panel from "../Panel";

type Props = {
    onLogout: () => void;
};


export default function UserSettingsWindow({
    onLogout
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


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    if(!open)
        return null;


    const originalUsername =
        getUsername() ?? "";


    const usernameChanged =
        username
            .trim()
            .toLowerCase()
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

            setError("");
            setSuccess("");


            const trimmedUsername =
                username
                    .trim()
                    .toLowerCase();


            /*
                Passwortprüfung
            */

            if(
                passwordEntered
                &&
                !passwordsMatch
            ){

                setError(
                    "Die neuen Passwörter stimmen nicht überein."
                );

                return;

            }


            if(
                passwordEntered
                &&
                !currentPassword
            ){

                setError(
                    "Bitte das aktuelle Passwort eingeben."
                );

                return;

            }


            if(
                passwordEntered
                &&
                !newPassword
            ){

                setError(
                    "Bitte ein neues Passwort eingeben."
                );

                return;

            }


            if(
                passwordEntered
                &&
                newPassword.length < 6
            ){

                setError(
                    "Das neue Passwort muss mindestens 6 Zeichen lang sein."
                );

                return;

            }


            setSaving(true);


            try {

                let usernameWasChanged =
                    false;


                let passwordWasChanged =
                    false;


                /*
                    Benutzername ändern
                */

                if(
                    usernameChanged
                ){

                    const result =
                        await updateUsername(
                            trimmedUsername
                        );


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


                /*
                    Passwort ändern
                */

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


                /*
                    Passwort geändert
                    -> Session ungültig
                */

                if(
                    passwordWasChanged
                ){
                    logout();
                    onLogout();
                    close();
                    return;

                }


                /*
                    Passwortfelder zurücksetzen
                */

                setCurrentPassword("");

                setNewPassword("");

                setNewPasswordRepeat("");


                /*
                    Erfolgsmeldung
                */

                if(
                    usernameWasChanged
                ){

                    setSuccess(
                        "Benutzername erfolgreich geändert."
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

                    setError(
                        error.message
                    );

                } else {

                    setError(
                        "Die Änderungen konnten nicht gespeichert werden."
                    );

                }

            } finally {

                setSaving(false);

            }

        };


    if(!open)
        return null;


    return (

        <Panel

            title="Benutzereinstellungen"

            width={400}

            minHeight={200}

            initialX={window.innerWidth / 2 - 200}

            initialY={100}

            onClose={close}

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

                    value={
                        username
                    }

                    onChange={
                        event => {

                            setUsername(
                                event.target.value
                            );

                            setError("");
                            setSuccess("");

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

                        value={
                            currentPassword
                        }

                        onChange={
                            event => {

                                setCurrentPassword(
                                    event.target.value
                                );

                                setError("");
                                setSuccess("");

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

                        value={
                            newPassword
                        }

                        onChange={
                            event => {

                                setNewPassword(
                                    event.target.value
                                );

                                setError("");
                                setSuccess("");

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

                        value={
                            newPasswordRepeat
                        }

                        onChange={
                            event => {

                                setNewPasswordRepeat(
                                    event.target.value
                                );

                                setError("");
                                setSuccess("");

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


            {
                error
                &&
                <div

                    style={{

                        marginTop:"15px",

                        padding:"8px",

                        borderRadius:"5px",

                        background:"#7a2020",

                        color:"white"

                    }}

                >

                    {error}

                </div>
            }


            {
                success
                &&
                <div

                    style={{

                        marginTop:"15px",

                        padding:"8px",

                        borderRadius:"5px",

                        background:"#205c32",

                        color:"white"

                    }}

                >

                    {success}

                </div>
            }


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