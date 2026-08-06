import { useState } from "react";
import { login } from "../../../utils/auth";


interface LoginPageProps {

    onLoginSuccess: () => void;

}



export default function LoginPage(
    {
        onLoginSuccess
    }: LoginPageProps
){

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    async function handleLogin(
        event: React.FormEvent
    ){

        event.preventDefault();


        setError("");

        setLoading(true);


        try {


            await login(
                username,
                password
            );


            onLoginSuccess();



        }
        catch(error){


            if(
                error instanceof Error
            ){

                setError(
                    error.message
                );

            }
            else{

                setError(
                    "Login fehlgeschlagen"
                );

            }


        }
        finally{

            setLoading(false);

        }

    }



    return (

        <div

            style={{

                width: "100vw",

                height: "100vh",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                background: "#050510",

                color: "white"

            }}

        >


            <div

                style={{

                    width: "350px",

                    padding: "40px",

                    background: "rgba(20,20,40,0.95)",

                    borderRadius: "12px",

                    boxShadow: "0 0 30px rgba(0,0,0,0.5)"

                }}

            >


                <h1

                    style={{

                        textAlign: "center",

                        marginBottom: "30px"

                    }}

                >

                    Galaxy Tool Login

                </h1>



                <form

                    onSubmit={handleLogin}

                    style={{

                        display: "flex",

                        flexDirection: "column"

                    }}

                >


                    <label

                        style={{

                            marginBottom: "5px"

                        }}

                    >

                        Benutzername

                    </label>



                    <input

                        type="text"

                        value={username}

                        onChange={

                            (e) =>

                                setUsername(
                                    e.target.value
                                )

                        }

                        required

                        style={{

                            padding: "10px",

                            marginBottom: "20px",

                            borderRadius: "6px",

                            border: "none"

                        }}

                    />



                    <label

                        style={{

                            marginBottom: "5px"

                        }}

                    >

                        Passwort

                    </label>



                    <input

                        type="password"

                        value={password}

                        onChange={

                            (e) =>

                                setPassword(
                                    e.target.value
                                )

                        }

                        required

                        style={{

                            padding: "10px",

                            marginBottom: "20px",

                            borderRadius: "6px",

                            border: "none"

                        }}

                    />



                    {
                        error &&

                        <p

                            style={{

                                color: "#ff6666",

                                textAlign: "center"

                            }}

                        >

                            {error}

                        </p>
                    }



                    <button

                        type="submit"

                        disabled={loading}

                        style={{

                            padding: "12px",

                            borderRadius: "6px",

                            border: "none",

                            cursor: "pointer"

                        }}

                    >

                        {
                            loading
                            ?
                            "Anmeldung..."
                            :
                            "Einloggen"
                        }

                    </button>


                </form>


            </div>


        </div>

    );

}