import { logout } from "./auth";
import type { Planet } from "../types/planet";
import type { Owner } from "../types/owner";





export function apiUrl(
    path: string
){

    return (
        path
    );

}



export function getAuthHeaders(): HeadersInit{

    const token =
        localStorage.getItem(
            "galaxy_token"
        );


    if(
        !token
    ){

        return {};

    }


    return {

        "Authorization":
            "Bearer " + token

    };

}





export async function galaxyFetch(
    path: string,
    options: RequestInit = {}
){

    const headers: HeadersInit = {

        "Content-Type":
            "application/json",


        ...getAuthHeaders(),


        ...(options.headers || {})

    };



    const response =
        await fetch(

            apiUrl(path),

            {

                ...options,

                headers

            }

        );



    if(
        response.status === 401
    ){

        logout();


        window.location.reload();


        throw new Error(
            "Session abgelaufen"
        );

    }



    return response;

}

//Planets -----------------------------------------------------------------------------------

export async function getPlanets(): Promise<Planet[]> {

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets"
        );


    if(
        !response.ok
    ){

        throw new Error(
            "Planeten konnten nicht geladen werden"
        );

    }


    return await response.json();

}






export async function createPlanet(
    planet: Planet
): Promise<Planet> {

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets",
            {
                method: "POST",
                body: JSON.stringify(planet)
            }
        );


    if(!response.ok){

        throw new Error(
            "Planet konnte nicht erstellt werden"
        );

    }


    return await response.json();

}






export async function updatePlanet(
    id: string,
    data: Partial<Planet>
): Promise<Planet> {


    const response =
        await galaxyFetch(

            "/wp-json/galaxy/v1/planets/" + id,

            {

                method:"PUT",

                body:JSON.stringify(
                    data
                )

            }

        );


    if(
        !response.ok
    ){

        throw new Error(
            "Planet konnte nicht aktualisiert werden"
        );

    }


    return await response.json();

}





export async function deletePlanet(
    id:string
):Promise<boolean>{


    const response =
        await galaxyFetch(

            "/wp-json/galaxy/v1/planets/" + id,

            {
                method:"DELETE"
            }

        );


    if(
        !response.ok
    ){

        throw new Error(
            "Planet konnte nicht gelöscht werden"
        );

    }


    return true;

}




//Owner -----------------------------------------------------------------------------------


export async function getOwners(): Promise<Owner[]> {

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/owners"
        );


    if(
        !response.ok
    ){

        throw new Error(
            "Besitzer konnten nicht geladen werden"
        );

    }


    return await response.json();

}


export async function createOwner(
    owner: Owner
): Promise<Owner> {

    const response =
        await galaxyFetch(

            "/wp-json/galaxy/v1/owners",

            {
                method: "POST",

                body:
                    JSON.stringify(
                        owner
                    )
            }

        );


    if(
        !response.ok
    ){

        throw new Error(
            "Besitzer konnte nicht erstellt werden"
        );

    }


    return await response.json();

}


export async function updateOwner(
    id: string,
    data: Partial<Owner>
): Promise<Owner> {

    const response =
        await galaxyFetch(

            "/wp-json/galaxy/v1/owners/" + id,

            {
                method: "PUT",

                body:
                    JSON.stringify(
                        data
                    )
            }

        );


    if(
        !response.ok
    ){

        throw new Error(
            "Besitzer konnte nicht aktualisiert werden"
        );

    }


    return await response.json();

}


export async function deleteOwner(
    id: string
): Promise<boolean> {

    const response =
        await galaxyFetch(

            "/wp-json/galaxy/v1/owners/" + id,

            {
                method: "DELETE"
            }

        );


    if(
        !response.ok
    ){

        throw new Error(
            "Besitzer konnte nicht gelöscht werden"
        );

    }


    return true;

}








