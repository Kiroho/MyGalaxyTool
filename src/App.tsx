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


function App(){
    
  const selectedPlanet = usePlanetStore(
    state => state.selectedPlanet
  );

  const presetPosition =
    useUIStore(
        state => state.createPlanetWindow.presetPosition
    );


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


  useEffect(() => {

      if(!loggedIn){

          disconnectGalaxyEvents();

          return;

      }

      const refreshPlanet =
          usePlanetStore.getState().refreshPlanet;

      connectGalaxyEvents(
          (event) => {

              try {

                  const payload =
                      JSON.parse(event.data);

                  console.log(
                      "Galaxy SSE:",
                      payload
                  );

                  if(
                      payload.event_type ===
                      "planet_updated"
                  ){

                      const id =
                          payload.data?.id;

                      if(id){

                          refreshPlanet(id);

                      }

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
        }} />

      <CreatePlanet
          key={
              presetPosition
              ?
              `${presetPosition.x}-${presetPosition.y}-${presetPosition.z}`
              :
              "empty"
          }
      />

      <OwnerWindow />
      <PlanetList />
      <FlightTimeWindow />
      <FleetWindow />
      <BuildingWindow />
      <SensorNetworkGeneratorWindow />
    </>

  );

}


export default App;