import { getToken } from "./auth";
import { apiUrl } from "./galaxyAPI";

let eventSource: EventSource | null = null;
let reconnectTimer: number | null = null;
let renewalTimer: number | null = null;
let currentHandler: ((event: MessageEvent) => void) | null = null;
let shouldReconnect = false;
let reconnectAttempt = 0;
let connectionInProgress = false;
let connectionId = 0;

function getReadyStateName(
    state: number
) {

    if(state === EventSource.CONNECTING){
        return "CONNECTING";
    }

    if(state === EventSource.OPEN){
        return "OPEN";
    }

    if(state === EventSource.CLOSED){
        return "CLOSED";
    }

    return "UNKNOWN";

}

async function getSseToken(){

    const token = getToken();

    if(!token){

        console.log(
            "SSE: Kein Login-Token vorhanden"
        );

        return null;

    }

    try{

        const response =
            await fetch(
                apiUrl(
                    "/wp-json/galaxy/v1/sse-token"
                ),
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if(!response.ok){

            console.log(
                "SSE: SSE-Token konnte nicht erstellt werden",
                data?.message
            );

            return null;

        }

        if(
            !data?.token ||
            !data?.expires
        ){

            console.log(
                "SSE: Ungültige SSE-Token-Antwort"
            );

            return null;

        }

        return {
            token: data.token as string,
            expires: Number(data.expires)
        };

    }catch(error){

        console.log(
            "SSE: Fehler beim Abrufen des SSE-Tokens",
            error
        );

        return null;

    }

}

export function connectGalaxyEvents(
    onEvent: (event: MessageEvent) => void
) {

    shouldReconnect = true;
    currentHandler = onEvent;

    if(eventSource || connectionInProgress){
        return;
    }

    createConnection();

}

async function createConnection(){

    if(!shouldReconnect){
        return;
    }

    if(connectionInProgress){
        return;
    }

    connectionInProgress = true;

    const sseToken =
        await getSseToken();

    connectionInProgress = false;

    if(!shouldReconnect){
        return;
    }

    if(!sseToken){

        scheduleReconnect();

        return;

    }

    const url =
        apiUrl(
            "/wp-json/galaxy/v1/events?token=" +
            encodeURIComponent(
                sseToken.token
            )
        );

    console.log(
        "SSE: Verbindung wird aufgebaut",
        new Date().toLocaleTimeString(),
        "Reconnect-Versuch:",
        reconnectAttempt
    );

    const source =
        new EventSource(url);

    eventSource = source;

    const thisConnectionId =
        ++connectionId;

    if(currentHandler){

        source.addEventListener(
            "galaxy_event",
            currentHandler
        );

    }

    source.onopen = () => {

        if(
            eventSource !== source ||
            thisConnectionId !== connectionId
        ){

            return;

        }

        console.log(
            "SSE: Verbindung hergestellt",
            new Date().toLocaleTimeString(),
            "readyState:",
            getReadyStateName(
                source.readyState
            )
        );

        reconnectAttempt = 0;

        scheduleRenewal(
            sseToken.expires
        );

    };

    source.onerror = () => {

        if(
            eventSource !== source ||
            thisConnectionId !== connectionId
        ){

            return;

        }

        console.log(
            "SSE: Verbindung unterbrochen",
            new Date().toLocaleTimeString(),
            "readyState:",
            getReadyStateName(
                source.readyState
            ),
            "readyState-Wert:",
            source.readyState
        );

        clearRenewalTimer();

        source.close();

        eventSource = null;

        scheduleReconnect();

    };

}

function scheduleRenewal(
    expires: number
){

    clearRenewalTimer();

    const now =
        Math.floor(
            Date.now() / 1000
        );

    const renewBefore =
        60;

    const delay =
        Math.max(
            1000,
            (
                expires -
                now -
                renewBefore
            ) * 1000
        );

    console.log(
        "SSE: Token-Erneuerung geplant in",
        Math.round(
            delay / 1000
        ),
        "Sekunden"
    );

    renewalTimer =
        window.setTimeout(
            () => {

                renewalTimer = null;

                renewSseConnection();

            },
            delay
        );

}

async function renewSseConnection(){

    if(!shouldReconnect){
        return;
    }

    console.log(
        "SSE: SSE-Token wird erneuert",
        new Date().toLocaleTimeString()
    );

    const sseToken =
        await getSseToken();

    if(!shouldReconnect){
        return;
    }

    if(!sseToken){

        console.log(
            "SSE: Token-Erneuerung fehlgeschlagen"
        );

        /*
            Noch bestehende Verbindung nicht
            sofort schließen.

            In 30 Sekunden erneut versuchen.
        */

        renewalTimer =
            window.setTimeout(
                () => {

                    renewalTimer = null;

                    renewSseConnection();

                },
                30000
            );

        return;

    }

    console.log(
        "SSE: Neuer SSE-Token erhalten"
    );

    if(eventSource){

        eventSource.close();

        eventSource = null;

    }

    createConnection();

}

function clearRenewalTimer(){

    if(renewalTimer !== null){

        window.clearTimeout(
            renewalTimer
        );

        renewalTimer = null;

    }

}

function scheduleReconnect(){

    if(!shouldReconnect){
        return;
    }

    if(reconnectTimer !== null){
        return;
    }

    const delays = [
        2000,
        4000,
        6000,
        8000,
        10000
    ];

    const baseDelay =
        delays[
            Math.min(
                reconnectAttempt,
                delays.length - 1
            )
        ];

    const jitter =
        Math.floor(
            Math.random() * 1000
        );

    const delay =
        baseDelay + jitter;

    reconnectAttempt++;

    console.log(
        "SSE: Reconnect geplant in",
        delay,
        "ms"
    );

    reconnectTimer =
        window.setTimeout(
            () => {

                reconnectTimer = null;

                console.log(
                    "SSE: Reconnect wird gestartet",
                    new Date().toLocaleTimeString()
                );

                createConnection();

            },
            delay
        );

}

export function disconnectGalaxyEvents(){

    shouldReconnect = false;

    currentHandler = null;

    reconnectAttempt = 0;

    connectionInProgress = false;

    clearRenewalTimer();

    if(reconnectTimer !== null){

        window.clearTimeout(
            reconnectTimer
        );

        reconnectTimer = null;

    }

    if(!eventSource){
        return;
    }

    console.log(
        "SSE: Verbindung wird absichtlich geschlossen"
    );

    eventSource.close();

    eventSource = null;

}