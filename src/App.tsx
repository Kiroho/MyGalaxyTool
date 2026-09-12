import GalaxyScene from "./components/GalaxyScene";
import PlanetInfo from "./components/ui/windows/PlanetInfo";
import MenuButton from "./components/ui/MenuButton";
import Menu from "./components/ui/Menu";
import OwnerWindow from "./components/ui/windows/OwnerWindow";
import { usePlanetStore } from "./store/planetStore";
import CreatePlanet from "./components/ui/windows/CreatePlanet";
import SensorButton from "./components/ui/SensorButton";
import PlanetList from "./components/ui/windows/PlanetList";
import FlightTimeWindow from "./components/ui/windows/FlightTimeWindow";
import BuildingWindow from "./components/ui/windows/BuildingWindow";
import SensorNetworkGeneratorWindow from "./components/ui/windows/SensorNetworkGeneratorWindow";
import { useUIStore } from "./store/uiStore";
import { useState, useEffect } from "react";
import LoginPage from "./components/ui/windows/LoginPage";
import { checkAuth, validateSession } from "./utils/auth";
import FleetWindow from "./components/ui/windows/FleetWindow";
import UserMenuButton from "./components/ui/UserMenuButton";
import UserSettingsWindow from "./components/ui/windows/UserSettingsWindow";
import { connectGalaxyEvents, disconnectGalaxyEvents } from "./utils/galaxyEvents";
import { getPlanet } from "./utils/galaxyAPI";
import { useOwnerStore } from "./store/ownerStore";
import { useFleetStore } from "./store/fleetStore";
import Toast from "./components/Toast";
import { useNotificationStore } from "./store/notificationStore";


function App(){
    
  const selectedPlanet = usePlanetStore(
    state => state.selectedPlanet
  );

    const presetPosition =
        useUIStore(
            state => state.createPlanetWindow.presetPosition
        );

    const panelOrder =
        useUIStore(
            state => state.panelOrder
        );

    const focusPanel =
        useUIStore(
            state => state.focusPanel
        );

    const getPanelZIndex = (
        panelId: string
    ) => {
        const index =
            panelOrder.indexOf(panelId);

        if(index === -1){
            return 200;
        }

        return 200 + index;
    };


    const [loggedIn, setLoggedIn] =
        useState(false);


  const [checkingAuth, setCheckingAuth] =
      useState(true);



  useEffect(() => {

      async function init() {


          const result =
              await checkAuth();


          setLoggedIn(result);


          setCheckingAuth(false);

      }


      init();

  }, []);



  useEffect(()=>{

      const interval =
          setInterval(
              () => {

                  validateSession()
                  .then(
                      (valid)=>{

                          if(!valid){

                              setLoggedIn(false);

                          }

                      }
                  );


              },

              5 * 60 * 1000
          );


      return () => {

          clearInterval(
              interval
          );

      };


  },[]);



    //Live Update an Client weitergeben
    useEffect(() => {

        if(!loggedIn){

            disconnectGalaxyEvents();

            return;

        }

        const refreshPlanet =
            usePlanetStore.getState().refreshPlanet;

        const addPlanetFromServer =
            usePlanetStore.getState().addPlanetFromServer;

        const removePlanetFromServer =
            usePlanetStore.getState().removePlanetFromServer;

        const refreshOwners =
            useOwnerStore.getState().refreshOwners;

        const refreshFleet =
            useFleetStore.getState().refreshFleet;

        const addNotification =
            useNotificationStore.getState().addNotification;


        connectGalaxyEvents(
            (event) => {

                try {

                    const payload =
                        JSON.parse(event.data);

                    console.log(
                        "Galaxy SSE:",
                        payload
                    );


                    const id =
                        payload.data?.id;



                    /*
                        Planet erstellt
                    */

                    if(
                        payload.event_type ===
                        "planet_created"
                    ){

                        if(!id){
                            return;
                        }

                        getPlanet(id)
                            .then(
                                (planet) => {

                                    addPlanetFromServer(
                                        planet
                                    );

                                    addNotification(
                                        `🪐 Planet „${planet.name}“ hinzugefügt`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Neuer Planet konnte nicht geladen werden:",
                                        error
                                    );

                                }
                            );

                    }



                    /*
                        Planet aktualisiert
                    */

                    if(
                        payload.event_type ===
                        "planet_updated"
                    ){

                        if(!id){
                            return;
                        }

                        const oldName =
                            payload.data?.old_name;

                        refreshPlanet(id)
                            .then(
                                () => {

                                    addNotification(
                                        `🪐 Planet „${oldName ?? "Unbekannt"}“ aktualisiert`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Planet konnte nach Live-Update nicht aktualisiert werden:",
                                        error
                                    );

                                }
                            );

                    }



                    /*
                        Planet gelöscht
                    */

                    if(
                        payload.event_type ===
                        "planet_deleted"
                    ){

                        if(!id){
                            return;
                        }

                        const oldName =
                            payload.data?.old_name;

                        removePlanetFromServer(
                            id
                        );

                        addNotification(
                            `🪐 Planet „${oldName ?? "Unbekannt"}“ gelöscht`,
                            "info"
                        );

                    }



                    /*
                        Owner erstellt
                    */

                    if(
                        payload.event_type ===
                        "owner_created"
                    ){

                        const ownerId =
                            payload.data?.id;

                        if(!ownerId){
                            return;
                        }

                        refreshOwners()
                            .then(
                                () => {

                                    const owner =
                                        useOwnerStore.getState().owners.find(
                                            owner =>
                                                String(owner.id) ===
                                                String(ownerId)
                                        );

                                    addNotification(
                                        `👤 Besitzer „${owner?.name ?? "Unbekannt"}“ hinzugefügt`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Owner-Liste konnte nach Erstellung nicht aktualisiert werden:",
                                        error
                                    );

                                }
                            );

                    }



                    /*
                        Owner aktualisiert
                    */

                    if(
                        payload.event_type ===
                        "owner_updated"
                    ){

                        const ownerId =
                            payload.data?.id;

                        if(!ownerId){
                            return;
                        }

                        const oldName =
                            payload.data?.old_name;

                        refreshOwners()
                            .then(
                                () => {

                                    addNotification(
                                        `👤 Besitzer „${oldName ?? "Unbekannt"}“ aktualisiert`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Owner-Liste konnte nach Änderung nicht aktualisiert werden:",
                                        error
                                    );

                                }
                            );

                    }



                    /*
                        Owner gelöscht
                    */

                    if(
                        payload.event_type ===
                        "owner_deleted"
                    ){

                        const ownerId =
                            payload.data?.id;

                        if(!ownerId){
                            return;
                        }

                        const oldName =
                            payload.data?.old_name;

                        refreshOwners()
                            .then(
                                () => {

                                    addNotification(
                                        `👤 Besitzer „${oldName ?? "Unbekannt"}“ gelöscht`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Owner-Liste konnte nach Löschung nicht aktualisiert werden:",
                                        error
                                    );

                                }
                            );

                    }



                    /*
                        Fleet aktualisiert
                    */

                    if(
                        payload.event_type ===
                        "fleet_updated"
                    ){

                        const ownerId =
                            payload.data?.owner_id;

                        if(!ownerId){
                            return;
                        }

                        const owner =
                            useOwnerStore.getState().owners.find(
                                owner =>
                                    String(owner.id) ===
                                    String(ownerId)
                            );

                        refreshFleet(
                            ownerId
                        )
                            .then(
                                () => {

                                    addNotification(
                                        `🚀 Flotte von „${owner?.name ?? "Unbekannt"}“ aktualisiert`,
                                        "info"
                                    );

                                }
                            )
                            .catch(
                                (error) => {

                                    console.error(
                                        "Fleet konnte nach Live-Update nicht aktualisiert werden:",
                                        error
                                    );

                                }
                            );

                    }

                } catch(error) {

                    console.error(
                        "SSE Event konnte nicht verarbeitet werden:",
                        error
                    );

                }

            }
        );


        return () => {

            disconnectGalaxyEvents();

        };

    }, [loggedIn]);





  if(checkingAuth){

    return null;

  }

  

  if(!loggedIn){

    return (

      <LoginPage

        onLoginSuccess={
          () => setLoggedIn(true)
        }

      />

    );

  }


  return (

    <>
        <GalaxyScene />

        <PlanetInfo
        key={selectedPlanet?.id ?? "none"} 
        />

        <MenuButton />
        <Menu />
        <SensorButton />

        <UserMenuButton
        onLogout={() => {
            setLoggedIn(false);
        }}
        />

        <UserSettingsWindow
            onLogout={() => {
                setLoggedIn(false);
            }}
            onFocus={() =>
                focusPanel("UserSettingsWindow")
            }
            zIndex={1000}
        />

        <CreatePlanet
            key={
                presetPosition
                ?
                `${presetPosition.x}-${presetPosition.y}-${presetPosition.z}`
                :
                "empty"
            }
            onFocus={() =>
                focusPanel("CreatePlanet")
            }
            zIndex={
                getPanelZIndex("CreatePlanet")
            }
        />        

        <OwnerWindow
            onFocus={() =>
                focusPanel("OwnerWindow")
            }
            zIndex={
                getPanelZIndex("OwnerWindow")
            }
        />
        <PlanetList
            onFocus={() =>
                focusPanel("PlanetList")
            }
            zIndex={
                getPanelZIndex("PlanetList")
            }
        />

        <FlightTimeWindow
            onFocus={() =>
                focusPanel("FlightTimeWindow")
            }
            zIndex={
                getPanelZIndex("FlightTimeWindow")
            }
        />

        <FleetWindow
            onFocus={() =>
                focusPanel("FleetWindow")
            }
            zIndex={
                getPanelZIndex("FleetWindow")
            }
        />

        <BuildingWindow
            onFocus={() =>
                focusPanel("BuildingWindow")
            }
            zIndex={
                getPanelZIndex("BuildingWindow")
            }
        />

        <SensorNetworkGeneratorWindow
            onFocus={() =>
                focusPanel(
                    "SensorNetworkGeneratorWindow"
                )
            }
            zIndex={
                getPanelZIndex(
                    "SensorNetworkGeneratorWindow"
                )
            }
        />
        
        <Toast />
    </>

  );

}


export default App;