import { create } from "zustand";
import type { Owner } from "../types/owner";


type OwnerStore = {

    owners: Owner[];

    setOwners: (owners: Owner[]) => void;

};


export const useOwnerStore = create<OwnerStore>((set)=>({

    owners: [],


    setOwners: (owners) =>
        set({
            owners
        }),

}));