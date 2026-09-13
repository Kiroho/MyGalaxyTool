import { logout } from "./auth";
import type { Planet } from "../types/planet";
import type { Owner } from "../types/owner";




// Fleet API Typ
export type FleetApiResponse = {
    id: number | string;
    owner_id: string;
    T1: number | string;
    T2: number | string;
    T3: number | string;
    S1: number | string;
    S2: number | string;
    S3: number | string;
};




// Live
export function apiUrl(path: string){
    return path;
}




export function getAuthHeaders(): HeadersInit{
    const token = localStorage.getItem("galaxy_token");

    if(!token){
        return {};
    }

    return {
        "Authorization": "Bearer " + token
    };
}

async function getResponseData(
    response: Response
): Promise<unknown>{

    if(response.status === 204){
        return null;
    }

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";

    if(!contentType.includes("application/json")){

        const text =
            await response.text();

        return text
            ? { message: text }
            : null;
    }

    try{
        return await response.json();
    }
    catch{
        return null;
    }
}

function getApiErrorMessage(
    data: unknown,
    response: Response
): string{

    if(
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
    ){
        return data.message;
    }

    if(
        typeof data === "object" &&
        data !== null &&
        "data" in data &&
        typeof data.data === "object" &&
        data.data !== null &&
        "message" in data.data &&
        typeof data.data.message === "string" &&
        data.data.message.trim()
    ){
        return data.data.message;
    }

    if(response.status === 400){
        return "Ungültige Anfrage.";
    }

    if(response.status === 403){
        return "Zugriff verweigert.";
    }

    if(response.status === 404){
        return "Der angeforderte Eintrag wurde nicht gefunden.";
    }

    if(response.status === 409){
        return "Die Anfrage konnte wegen eines Konflikts nicht ausgeführt werden.";
    }

    if(response.status >= 500){
        return "Der Server konnte die Anfrage nicht verarbeiten.";
    }

    return "Die Anfrage konnte nicht verarbeitet werden.";
}

export async function galaxyFetch(
    path: string,
    options: RequestInit = {}
){

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(options.headers || {})
    };

    let response: Response;

    try{

        response = await fetch(
            apiUrl(path),
            {
                ...options,
                headers
            }
        );

    }
    catch(error){

        console.error(
            "Galaxy API Netzwerkfehler:",
            error
        );

        throw new Error(
            "Der Server ist nicht erreichbar. Bitte prüfe deine Internetverbindung.",
            {
                cause: error
            }
        );
    }

    if(response.status === 401){

        logout();

        window.location.reload();

        throw new Error(
            "Session abgelaufen"
        );
    }

    if(!response.ok){

        const data =
            await getResponseData(
                response
            );

        console.error(
            "Galaxy API Fehler:",
            {
                path,
                status: response.status,
                data
            }
        );

        throw new Error(
            getApiErrorMessage(
                data,
                response
            )
        );
    }

    return response;
}

async function getJson<T>(
    response: Response
): Promise<T>{

    const data =
        await getResponseData(
            response
        );

    if(data === null){

        throw new Error(
            "Der Server hat keine gültige Antwort zurückgegeben."
        );
    }

    return data as T;
}



// Planets -----------------------------------------------------------------------------------

export async function getPlanets(): Promise<Planet[]>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets"
        );

    return getJson<Planet[]>(
        response
    );
}

export async function getPlanet(
    id: string
): Promise<Planet>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets/" +
            encodeURIComponent(id)
        );

    return getJson<Planet>(
        response
    );
}

export async function createPlanet(
    planet: Planet
): Promise<Planet>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets",
            {
                method: "POST",
                body: JSON.stringify(
                    planet
                )
            }
        );

    return getJson<Planet>(
        response
    );
}

export async function updatePlanet(
    id: string,
    data: Partial<Planet>
): Promise<Planet>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/planets/" +
            encodeURIComponent(id),
            {
                method: "PUT",
                body: JSON.stringify(
                    data
                )
            }
        );

    return getJson<Planet>(
        response
    );
}

export async function deletePlanet(
    id: string
): Promise<boolean>{

    await galaxyFetch(
        "/wp-json/galaxy/v1/planets/" +
        encodeURIComponent(id),
        {
            method: "DELETE"
        }
    );

    return true;
}



// Owner -----------------------------------------------------------------------------------

export async function getOwners(): Promise<Owner[]>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/owners"
        );

    return getJson<Owner[]>(
        response
    );
}

export async function createOwner(
    owner: Owner
): Promise<Owner>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/owners",
            {
                method: "POST",
                body: JSON.stringify(
                    owner
                )
            }
        );

    return getJson<Owner>(
        response
    );
}

export async function updateOwner(
    id: string,
    data: Partial<Owner>
): Promise<Owner>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/owners/" +
            encodeURIComponent(id),
            {
                method: "PUT",
                body: JSON.stringify(
                    data
                )
            }
        );

    return getJson<Owner>(
        response
    );
}

export async function deleteOwner(
    id: string
): Promise<boolean>{

    await galaxyFetch(
        "/wp-json/galaxy/v1/owners/" +
        encodeURIComponent(id),
        {
            method: "DELETE"
        }
    );

    return true;
}



// Fleet -----------------------------------------------------------------------------------

export async function getFleet(
    ownerId: string
): Promise<FleetApiResponse>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/fleets/" +
            encodeURIComponent(ownerId)
        );

    return getJson<FleetApiResponse>(
        response
    );
}

export async function createFleet(
    ownerId: string
): Promise<FleetApiResponse>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/fleets",
            {
                method: "POST",
                body: JSON.stringify({
                    owner_id: ownerId
                })
            }
        );

    return getJson<FleetApiResponse>(
        response
    );
}

export async function updateFleet(
    ownerId: string,
    data: Record<string, number>
): Promise<FleetApiResponse>{

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/fleets/" +
            encodeURIComponent(ownerId),
            {
                method: "PUT",
                body: JSON.stringify(
                    data
                )
            }
        );

    return getJson<FleetApiResponse>(
        response
    );
}



// Benutzer -----------------------------------------------------------------------------------

export async function updateUsername(
    username: string
){

    const token =
        localStorage.getItem(
            "galaxy_token"
        );

    if(!token){

        throw new Error(
            "Keine gültige Sitzung vorhanden."
        );
    }

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/user/update-username",
            {
                method: "POST",
                body: JSON.stringify({
                    username
                })
            }
        );

    return getJson(
        response
    );
}

export async function updatePassword(
    currentPassword: string,
    newPassword: string
){

    const token =
        localStorage.getItem(
            "galaxy_token"
        );

    if(!token){

        throw new Error(
            "Keine gültige Sitzung vorhanden."
        );
    }

    const response =
        await galaxyFetch(
            "/wp-json/galaxy/v1/user/update-password",
            {
                method: "POST",
                body: JSON.stringify({
                    current_password:
                        currentPassword,
                    new_password:
                        newPassword
                })
            }
        );

    return getJson(
        response
    );
}