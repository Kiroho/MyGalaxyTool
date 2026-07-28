import { create } from "zustand";
import type { Owner } from "../types/owner";


type OwnerStore = {

    owners: Owner[];


    setOwners: (
        owners: Owner[]
    ) => void;


    addOwner: (
        owner: Owner
    ) => void;


    updateOwner: (
        id: string,
        changes: Partial<Owner>
    ) => void;


    deleteOwner: (
        id: string
    ) => void;

};



export const useOwnerStore = create<OwnerStore>((set)=>({


    owners: [],



    setOwners: (owners) =>
        set({
            owners
        }),



    addOwner: (owner) =>
        set(state=>({

            owners:[
                ...state.owners,
                owner
            ]

        })),



    updateOwner: (
        id,
        changes
    ) =>
        set(state=>({

            owners:
                state.owners.map(owner=>

                    owner.id === id

                    ? {
                        ...owner,
                        ...changes
                    }

                    : owner

                )

        })),



    deleteOwner: (id) =>
        set(state=>({

            owners:
                state.owners.filter(owner=>
                    owner.id !== id
                )

        }))



}));