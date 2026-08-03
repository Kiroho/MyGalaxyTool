import { create } from "zustand";

type WindowState = {
    open: boolean;
};

type UIStore = {

    menuOpen: boolean;

    showSensors: boolean;

    createPlanetWindow: WindowState;

    ownerWindow: WindowState;

    planetListWindow: WindowState;

    selectedOwnerIds: string[];

    flightTimeWindow: WindowState;


    toggleMenu: () => void;
    closeMenu: () => void;

    toggleSensors: () => void;

    openOwnerWindow: () => void;
    closeOwnerWindow: () => void;


    openPlanetListWindow: () => void;
    closePlanetListWindow: () => void;

    openCreatePlanetWindow: () => void;
    closeCreatePlanetWindow: () => void;

    setSelectedOwnerIds: (
        updater: string[] | ((prev:string[]) => string[])
    )=>void;

    
    openFlightTimeWindow: () => void;
    closeFlightTimeWindow: () => void;

};


export const useUIStore = create<UIStore>((set)=>({

    menuOpen: false,

    showSensors:false,

    createPlanetWindow: {
        open: false
    },
    
    ownerWindow: {
        open: false
    },

    planetListWindow: {
        open: false
    },

    selectedOwnerIds: [],

    flightTimeWindow: {
        open: false
    },

    
    toggleSensors: () =>
    set(state=>({
        showSensors: !state.showSensors
    })),

    toggleMenu: () =>
        set(state=>({
            menuOpen: !state.menuOpen
        })),

    closeMenu: () =>
        set({
            menuOpen: false
        }),

    openCreatePlanetWindow: () =>
        set({
            createPlanetWindow: {
                open: true
            }
        }),

    closeCreatePlanetWindow: () =>
        set({
            createPlanetWindow: {
                open: false
            }
        }),

    openOwnerWindow: () =>
        set({
            ownerWindow: {
                open: true
            }
        }),

    closeOwnerWindow: () =>
        set({
            ownerWindow: {
                open: false
            }
        }),


    openPlanetListWindow: () =>
        set({
            planetListWindow: {
                open: true
            }
        }),

    closePlanetListWindow: () =>
        set({
            planetListWindow: {
                open: false
            }
        }),

    setSelectedOwnerIds:(updater)=>{

        set(state => ({

            selectedOwnerIds:
                typeof updater === "function"
                ? updater(state.selectedOwnerIds)
                : updater

        }));

    },

    openFlightTimeWindow: ()=>{

        set({

            flightTimeWindow:{
                open:true
            }

        });

    },


    closeFlightTimeWindow: ()=>{

        set({

            flightTimeWindow:{
                open:false
            }

        });

    },




}));