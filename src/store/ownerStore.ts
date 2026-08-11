import { create } from "zustand";
import type { Owner } from "../types/owner";

import {
    getOwners,
    createOwner as apiCreateOwner,
    updateOwner as apiUpdateOwner,
    deleteOwner as apiDeleteOwner
} from "../utils/galaxyAPI";


type OwnerStore = {

    owners: Owner[];


    setOwners: (
        owners: Owner[]
    ) => void;


    loadOwners: () => Promise<void>;


    addOwner: (
        owner: Owner
    ) => Promise<Owner>;


    updateOwner: (
        id: string,
        changes: Partial<Owner>
    ) => Promise<Owner>;


    deleteOwner: (
        id: string
    ) => Promise<boolean>;

};



export const useOwnerStore =
    create<OwnerStore>((set) => ({

        owners: [],


        setOwners: (owners) =>
            set({
                owners
            }),



        loadOwners: async () => {

            console.log(
                "Lade Besitzer aus API..."
            );


            const owners =
                await getOwners();


            console.log(
                "Besitzer von API:",
                owners
            );


            set({
                owners
            });

        },



        addOwner: async (
            owner
        ) => {

            const created =
                await apiCreateOwner(
                    owner
                );


            set(state => ({

                owners: [
                    ...state.owners,
                    created
                ]

            }));


            return created;

        },



        updateOwner: async (
            id,
            changes
        ) => {

            const updated =
                await apiUpdateOwner(
                    id,
                    changes
                );


            set(state => ({

                owners:
                    state.owners.map(
                        owner =>
                            owner.id === id
                            ? updated
                            : owner
                    )

            }));


            return updated;

        },



        deleteOwner: async (
            id
        ) => {

            await apiDeleteOwner(
                id
            );


            set(state => ({

                owners:
                    state.owners.filter(
                        owner =>
                            owner.id !== id
                    )

            }));


            return true;

        }

    }));