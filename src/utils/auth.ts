import {
    apiUrl
} from "./galaxyAPI";



const LOGIN_URL =
    apiUrl(
        "/wp-json/galaxy/v1/login"
    );


const ME_URL =
    apiUrl(
        "/wp-json/galaxy/v1/me"
    );



export async function login(
    username: string,
    password: string
){

    const response =
        await fetch(
            LOGIN_URL,
            {

                method:"POST",

                headers:{

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    username,

                    password

                })

            }
        );



    const data =
        await response.json();



    if(
        !response.ok
    ){

        throw new Error(
            data.message ||
            "Login fehlgeschlagen"
        );

    }



    localStorage.setItem(
        "galaxy_token",
        data.token
    );


    localStorage.setItem(
        "galaxy_username",
        data.username
    );



    return data;

}





export async function checkAuth(){

    const token =
        getToken();

    console.log(
        "Galaxy Token:",
        token
    );

    if(
        !token
    ){
        console.log(
            "Kein Token"
        );

        return false;

    }



    const response =
        await fetch(
            ME_URL,
            {

                method:"GET",

                headers:{

                    "Authorization":
                        "Bearer " + token

                }

            }
        );

    console.log(
        "Galaxy /me Status:",
        response.status
    );

    if(
        !response.ok
    ){

        console.log(
            "Session ungültig - Logout"
        );

        logout();

        return false;

    }



    return true;

}





export function getToken(){

    return localStorage.getItem(
        "galaxy_token"
    );

}





export function getUsername(){

    return localStorage.getItem(
        "galaxy_username"
    );

}





export function isLoggedIn(){

    return !!getToken();

}





export function logout(){

    localStorage.removeItem(
        "galaxy_token"
    );


    localStorage.removeItem(
        "galaxy_username"
    );

}


export async function validateSession(){

    const token =
        getToken();


    if(
        !token
    ){

        return false;

    }



    const response =
        await fetch(
            ME_URL,
            {
                method:"GET",

                headers:{

                    "Authorization":
                        "Bearer " + token

                }

            }
        );



    if(
        !response.ok
    ){

        logout();

        return false;

    }



    return true;

}