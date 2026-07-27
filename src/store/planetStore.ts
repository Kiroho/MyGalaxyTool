import { create } from "zustand";
import type { Planet } from "../types/planet";


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
  ) => void;


  // Neu erstellen
  addPlanet: (
    planet: Planet
  ) => void;


  // Löschen
  deletePlanet: (
    id: string
  ) => void;

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
      selectedPlanet: planet
    }),



  clearSelection: () =>
    set({
      selectedPlanet: null
    }),



  updatePlanet: (id, data) =>
    set((state)=>({

      planets: state.planets.map((planet)=>

        planet.id === id
          ?
          {
            ...planet,
            ...data
          }
          :
          planet

      ),

      selectedPlanet:
        state.selectedPlanet?.id === id
          ?
          {
            ...state.selectedPlanet,
            ...data
          }
          :
          state.selectedPlanet

    })),



  addPlanet: (planet) =>
    set((state)=>({

      planets:[
        ...state.planets,
        planet
      ]

    })),



  deletePlanet: (id) =>
    set((state)=>({

      planets:
        state.planets.filter(
          planet => planet.id !== id
        ),


      selectedPlanet:
        state.selectedPlanet?.id === id
          ?
          null
          :
          state.selectedPlanet

    }))

}));