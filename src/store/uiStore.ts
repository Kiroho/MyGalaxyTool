import { create } from "zustand";

type WindowState = {
    open: boolean;
};

type UIStore = {

    menuOpen: boolean;

    createPlanetWindow: WindowState;

    ownerWindow: WindowState;

    filterWindow: WindowState;


    toggleMenu: () => void;

    closeMenu: () => void;


    openOwnerWindow: () => void;
    closeOwnerWindow: () => void;


    openFilterWindow: () => void;
    closeFilterWindow: () => void;

    openCreatePlanetWindow: () => void;
    closeCreatePlanetWindow: () => void;

};


export const useUIStore = create<UIStore>((set)=>({

    menuOpen: false,


    createPlanetWindow: {
        open: false
    },
    
    ownerWindow: {
        open: false
    },

    filterWindow: {
        open: false
    },



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


    openFilterWindow: () =>
        set({
            filterWindow: {
                open: true
            }
        }),

    closeFilterWindow: () =>
        set({
            filterWindow: {
                open: false
            }
        })

}));