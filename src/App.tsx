import GalaxyScene from "./components/GalaxyScene";
import PlanetInfo from "./components/ui/windows/PlanetInfo";
import MenuButton from "./components/ui/MenuButton";
import Menu from "./components/ui/Menu";
import OwnerWindow from "./components/ui/windows/OwnerWindow";
import { usePlanetStore } from "./store/planetStore";
import CreatePlanet from "./components/ui/windows/CreatePlanet";
import SensorButton from "./components/ui/SensorButton";
import PlanetList from "./components/ui/windows/PlanetList";



function App(){

  const selectedPlanet = usePlanetStore(
    state => state.selectedPlanet
  );

  return (

    <>
      <GalaxyScene />

      <PlanetInfo
      key={selectedPlanet?.id ?? "none"} 
      />



      <MenuButton />
      <Menu />
      <SensorButton />

      <CreatePlanet />
      <OwnerWindow />
      <PlanetList />
    </>

  );

}


export default App;