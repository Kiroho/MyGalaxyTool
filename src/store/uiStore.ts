import { create } from "zustand";

type WindowState = {
    open: boolean;
};

type UIStore = {
    menuOpen: boolean;
    showSensors: boolean;
    createPlanetWindow: {
        open: boolean;
        presetPosition: {
            x: number;
            y: number;
            z: number;
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
    panelOrder: string[];
    toggleMenu: () => void;
    closeMenu: () => void;
    toggleSensors: () => void;
    focusPanel: (panelId: string) => void;
    getPanelZIndex: (panelId: string) => number;
    openOwnerWindow: () => void;
    closeOwnerWindow: () => void;
    openPlanetListWindow: () => void;
    closePlanetListWindow: () => void;
    openCreatePlanetWindow: () => void;
    closeCreatePlanetWindow: () => void;
    openCreatePlanetWithPosition: (
        position: {
            x: number;
            y: number;
            z: number;
        }
    ) => void;
    setSelectedOwnerIds: (
        updater:
            | string[]
            | ((prev: string[]) => string[])
    ) => void;
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

export const useUIStore = create<UIStore>((set, get) => ({
    menuOpen: false,
    showSensors: false,
    createPlanetWindow: {
        open: false,
        presetPosition: null
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
    sensorNetworkWindow: {
        open: false
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
    panelOrder: [],
    toggleSensors: () =>
        set(state => ({
            showSensors: !state.showSensors
        })),
    toggleMenu: () =>
        set(state => ({
            menuOpen: !state.menuOpen
        })),
    closeMenu: () =>
        set({
            menuOpen: false
        }),
    focusPanel: (panelId) =>
        set(state => ({
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== panelId
                ),
                panelId
            ]
        })),
    getPanelZIndex: (panelId) => {
        const index =
            get().panelOrder.indexOf(
                panelId
            );
        if(index === -1){
            return 200;
        }
        return 200 + index;
    },
    openCreatePlanetWindow: () =>
        set(state => ({
            createPlanetWindow: {
                open: true,
                presetPosition: null
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "CreatePlanet"
                ),
                "CreatePlanet"
            ]
        })),
    openCreatePlanetWithPosition: (position) =>
        set(state => ({
            createPlanetWindow: {
                open: true,
                presetPosition: position
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "CreatePlanet"
                ),
                "CreatePlanet"
            ]
        })),
    closeCreatePlanetWindow: () =>
        set({
            createPlanetWindow: {
                open: false,
                presetPosition: null
            }
        }),
    openOwnerWindow: () =>
        set(state => ({
            ownerWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "OwnerWindow"
                ),
                "OwnerWindow"
            ]
        })),
    closeOwnerWindow: () =>
        set({
            ownerWindow: {
                open: false
            }
        }),
    openPlanetListWindow: () =>
        set(state => ({
            planetListWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "PlanetList"
                ),
                "PlanetList"
            ]
        })),
    closePlanetListWindow: () =>
        set({
            planetListWindow: {
                open: false
            }
        }),
    setSelectedOwnerIds: (updater) =>
        set(state => ({
            selectedOwnerIds:
                typeof updater === "function"
                    ? updater(
                        state.selectedOwnerIds
                    )
                    : updater
        })),
    openFlightTimeWindow: () =>
        set(state => ({
            flightTimeWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "FlightTimeWindow"
                ),
                "FlightTimeWindow"
            ]
        })),
    closeFlightTimeWindow: () =>
        set({
            flightTimeWindow: {
                open: false
            }
        }),
    openSensorNetworkWindow: () =>
        set(state => ({
            sensorNetworkWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id =>
                        id !==
                        "SensorNetworkGeneratorWindow"
                ),
                "SensorNetworkGeneratorWindow"
            ]
        })),
    closeSensorNetworkWindow: () =>
        set({
            sensorNetworkWindow: {
                open: false
            }
        }),
    openBuildingWindow: () =>
        set(state => ({
            buildingWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "BuildingWindow"
                ),
                "BuildingWindow"
            ]
        })),
    closeBuildingWindow: () =>
        set({
            buildingWindow: {
                open: false
            }
        }),
    openFleetWindow: () =>
        set(state => ({
            fleetWindow: {
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id => id !== "FleetWindow"
                ),
                "FleetWindow"
            ]
        })),
    closeFleetWindow: () =>
        set({
            fleetWindow: {
                open: false
            }
        }),
    openUserSettingsWindow: () =>
        set(state => ({
            userSettingsWindow: {
                ...state.userSettingsWindow,
                open: true
            },
            panelOrder: [
                ...state.panelOrder.filter(
                    id =>
                        id !==
                        "UserSettingsWindow"
                ),
                "UserSettingsWindow"
            ]
        })),
    closeUserSettingsWindow: () =>
        set(state => ({
            userSettingsWindow: {
                ...state.userSettingsWindow,
                open: false
            }
        }))
}));