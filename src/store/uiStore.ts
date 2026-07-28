import { create } from "zustand";

type WindowState = {
    open: boolean;
};

type UIStore = {

    menuOpen: boolean;

    ownerWindow: WindowState;

    filterWindow: WindowState;


    toggleMenu: () => void;

    closeMenu: () => void;


    openOwnerWindow: () => void;
    closeOwnerWindow: () => void;


    openFilterWindow: () => void;
    closeFilterWindow: () => void;

};


export const useUIStore = create<UIStore>((set)=>({

    menuOpen: false,

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