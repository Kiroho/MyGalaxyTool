import { create } from "zustand";
import type { Planet } from "../types/planet";
import {
    getPlanets,
    createPlanet,
    updatePlanet as apiUpdatePlanet,
    deletePlanet as apiDeletePlanet
} from "../utils/galaxyAPI";


type PlanetStore = {

  // alle Planeten im aktuellen Universum
  planets: Planet[];

  // aktuell ausgewählter Planet
  selectedPlanet: Planet | null;
  


  // Daten laden
  setPlanets: (planets: Planet[]) => void;


  // Auswahl
  selectPlanet: (planet: Planet) => void;

  clearSelection: () => void;


  // Bearbeiten
  updatePlanet: (
      id: string,
      data: Partial<Planet>
  ) => Promise<Planet>;


  // Neu erstellen
  addPlanet: (
    planet: Planet
  ) => Promise<Planet>;


  // Löschen
  deletePlanet: (
    id: string
  ) => Promise<void>;

  //Preview
  previewPlanet: Planet | null;

  setPreviewPlanet: (
      planet: Planet | null
  ) => void;

  loadPlanets: () => Promise<void>;


};


export const usePlanetStore = create<PlanetStore>((set)=>({

  planets: [],

  selectedPlanet: null,


  setPlanets: (planets) =>
    set({
      planets
    }),



  selectPlanet: (planet) =>
    set({
      selectedPlanet: planet,
      previewPlanet:null
    }),



  clearSelection: () =>
    set({
      selectedPlanet: null,
      previewPlanet:null
    }),

    
    previewPlanet: null,

    setPreviewPlanet:(planet)=>
    set({
        previewPlanet:planet
    }),



    

  updatePlanet: async (
      id,
      data
  )=>{

      const updated =
          await apiUpdatePlanet(
              id,
              data
          );

      set((state)=>({
          planets:
              state.planets.map(
                  planet =>
                      planet.id === id
                      ?
                      updated
                      :
                      planet
              ),


          selectedPlanet:
              state.selectedPlanet?.id === id
              ?
              updated
              :
              state.selectedPlanet
      }));
      return updated;

  },



  addPlanet: async (planet)=>{

      const created =
          await createPlanet(
              planet
          );

              console.log(
        "Erstellter Planet:",
        created
    );

      set((state)=>({

          planets:[
              ...state.planets,
              created
          ]

      }));
      return created;

  },



  deletePlanet: async (
      id
  )=>{
      await apiDeletePlanet(
          id
      );


      set((state)=>({

          planets:
              state.planets.filter(
                  planet =>
                      planet.id !== id
              ),


          selectedPlanet:
              state.selectedPlanet?.id === id
              ?
              null
              :
              state.selectedPlanet

      }));

  },




    
loadPlanets: async () => {

    console.log("Lade Planeten aus API...");

    const planets =
        await getPlanets();

    console.log(
        "Planeten von API:",
        planets
    );

    set({
        planets
    });

},


}));