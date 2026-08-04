import { create } from "zustand";

type WindowState = {
    open: boolean;
};

type UIStore = {

    menuOpen: boolean;

    showSensors: boolean;

    createPlanetWindow:{
        open:boolean;

        presetPosition:{
            x:number;
            y:number;
            z:number;
        } | null;
    };

    ownerWindow: WindowState;

    planetListWindow: WindowState;

    selectedOwnerIds: string[];

    flightTimeWindow: WindowState;

    sensorNetworkWindow: WindowState;



    toggleMenu: () => void;
    closeMenu: () => void;

    toggleSensors: () => void;

    openOwnerWindow: () => void;
    closeOwnerWindow: () => void;


    openPlanetListWindow: () => void;
    closePlanetListWindow: () => void;

    openCreatePlanetWindow: () => void;
    closeCreatePlanetWindow: () => void;
    openCreatePlanetWithPosition: (
        position:{
            x:number;
            y:number;
            z:number;
        }
    )=>void;

    setSelectedOwnerIds: (
        updater: string[] | ((prev:string[]) => string[])
    )=>void;

    
    openFlightTimeWindow: () => void;
    closeFlightTimeWindow: () => void;

    openSensorNetworkWindow: () => void;
    closeSensorNetworkWindow: () => void;

};


export const useUIStore = create<UIStore>((set)=>({

    menuOpen: false,

    showSensors:false,

    createPlanetWindow: {
        open: false,
        presetPosition:null
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

    sensorNetworkWindow:{
        open:false
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

    openCreatePlanetWindow:()=>{

        set({

            createPlanetWindow:{

                open:true,

                presetPosition:null

            }

        });

    },

    openCreatePlanetWithPosition:(position)=>{

        set({

            createPlanetWindow:{

                open:true,

                presetPosition:position

            }

        });

    },

    closeCreatePlanetWindow: () =>
        set({
            createPlanetWindow: {
                open:false,
                presetPosition:null
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

    openSensorNetworkWindow: ()=>{
        set({
            sensorNetworkWindow:{
                open:true
            }
        });
    },

    
    closeSensorNetworkWindow: ()=>{
        set({
            sensorNetworkWindow:{
                open:false
            }
        });
    },




}));