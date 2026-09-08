import { create } from "zustand";
import type { Planet } from "../types/planet";
import {
    getPlanet,
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

  // Einzelnen Planet refreshen
  refreshPlanet: (id: string) => Promise<void>;

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

// Planeten Setzen und Löschen via live update
addPlanetFromServer: (planet: Planet) => void;
removePlanetFromServer: (id: string) => void;


};


export const usePlanetStore = create<PlanetStore>((set)=>({

    planets: [],

    selectedPlanet: null,


    setPlanets: (planets) =>
    set({
        planets
    }),


    refreshPlanet: async (id) => {

        const planet =
            await getPlanet(id);

        set((state) => ({

            planets:
                state.planets.map(
                    existingPlanet =>
                        existingPlanet.id === id
                        ?
                        planet
                        :
                        existingPlanet
                ),

            selectedPlanet:
                state.selectedPlanet?.id === id
                ?
                planet
                :
                state.selectedPlanet

        }));

    },


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

        // const start =
        //     performance.now();

        const updated =
            await apiUpdatePlanet(
                id,
                data
            );

        // console.log(
        //     "Planet PUT Dauer:",
        //     performance.now() - start,
        //     "ms"
        // );

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

        const planets =
            await getPlanets();

        set({
            planets
        });

    },

    addPlanetFromServer: (planet) =>
        set((state) => {

            if(
                state.planets.some(
                    existingPlanet =>
                        existingPlanet.id === planet.id
                )
            ){
                return state;
            }

            return {
                planets: [
                    ...state.planets,
                    planet
                ]
            };

        }),

    removePlanetFromServer: (id) =>
        set((state) => ({
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
        })),


}));