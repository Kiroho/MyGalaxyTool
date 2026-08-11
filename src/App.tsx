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
import SensorNetworkGeneratorWindow from "./components/ui/windows/SensorNetworkGeneratorWindow";
import { useUIStore } from "./store/uiStore";
import { useState, useEffect } from "react";
import LoginPage from "./components/ui/windows/LoginPage";
import { checkAuth, validateSession } from "./utils/auth";

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

          console.log("APP INIT");


          const result =
              await checkAuth();


          console.log(
              "AUTH RESULT:",
              result
          );


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
      <SensorNetworkGeneratorWindow />
    </>

  );

}


export default App;