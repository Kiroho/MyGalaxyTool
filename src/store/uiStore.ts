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

    buildingWindow: WindowState;

    fleetWindow: WindowState;

    userSettingsWindow: WindowState;



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

    openBuildingWindow: () => void;
    closeBuildingWindow: () => void;

    openFleetWindow: () => void;
    closeFleetWindow: () => void;

    openUserSettingsWindow: () => void;
    closeUserSettingsWindow: () => void;

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

    buildingWindow: {
        open: false
    },


    fleetWindow: {
        open: false
    },

    userSettingsWindow: {
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

    openBuildingWindow: () =>
    set({
        buildingWindow: {
            open: true
        }
    }),


    closeBuildingWindow: () =>
        set({
            buildingWindow: {
                open: false
            }
        }),

        
    openFleetWindow: () => {

        set({

            fleetWindow: {
                open: true
            }

        });

    },


    closeFleetWindow: () => {

        set({

            fleetWindow: {
                open: false
            }

        });

    },


    openUserSettingsWindow: () =>
        set(state => ({

            userSettingsWindow: {
                ...state.userSettingsWindow,
                open: true
            }

        })),

    closeUserSettingsWindow: () =>
        set(state => ({

            userSettingsWindow: {
                ...state.userSettingsWindow,
                open: false
            }

        })),




}));