import GalaxyScene from "./components/GalaxyScene";
import PlanetInfo from "./components/ui/windows/PlanetInfo";
import MenuButton from "./components/ui/MenuButton";
import Menu from "./components/ui/Menu";
import OwnerWindow from "./components/ui/windows/OwnerWindow";


function App(){

  return (

    <>
      <GalaxyScene />

      <PlanetInfo />
      <MenuButton />
      <Menu />

      <OwnerWindow />
    </>

  );

}


export default App;