import { create } from "zustand";

import {
    getFleet,
    createFleet as apiCreateFleet,
    updateFleet as apiUpdateFleet
} from "../utils/galaxyAPI";


export type Fleet = {

    id: number;

    owner_id: string;

    T1: number;
    T2: number;
    T3: number;

    S1: number;
    S2: number;
    S3: number;

};


export type FleetChanges = {

    T1?: number;
    T2?: number;
    T3?: number;

    S1?: number;
    S2?: number;
    S3?: number;

};


type FleetStore = {

    fleets: Record<string, Fleet>;


    loadFleet: (
        ownerId: string
    ) => Promise<Fleet>;


    createFleet: (
        ownerId: string
    ) => Promise<Fleet>;


    updateFleet: (
        ownerId: string,
        changes: FleetChanges
    ) => Promise<Fleet>;

    //Für Live Update
    refreshFleet: (ownerId: string) => Promise<Fleet>;

};


export const useFleetStore =
    create<FleetStore>((set, get) => ({

        fleets: {},


        loadFleet: async (
            ownerId
        ) => {

            const fleet =
                await getFleet(
                    ownerId
                );


            const normalizedFleet: Fleet = {

                ...fleet,

                id:
                    Number(
                        fleet.id
                    ),

                T1:
                    Number(
                        fleet.T1
                    ),

                T2:
                    Number(
                        fleet.T2
                    ),

                T3:
                    Number(
                        fleet.T3
                    ),

                S1:
                    Number(
                        fleet.S1
                    ),

                S2:
                    Number(
                        fleet.S2
                    ),

                S3:
                    Number(
                        fleet.S3
                    )

            };


            set(
                state => ({

                    fleets: {

                        ...state.fleets,

                        [ownerId]:
                            normalizedFleet

                    }

                })
            );


            return normalizedFleet;

        },


        createFleet: async (
            ownerId
        ) => {

            const fleet =
                await apiCreateFleet(
                    ownerId
                );


            const normalizedFleet: Fleet = {

                ...fleet,

                id:
                    Number(
                        fleet.id
                    ),

                owner_id:
                    ownerId,

                T1: 0,
                T2: 0,
                T3: 0,

                S1: 0,
                S2: 0,
                S3: 0,

            };


            set(
                state => ({

                    fleets: {

                        ...state.fleets,

                        [ownerId]:
                            normalizedFleet

                    }

                })
            );


            return normalizedFleet;

        },


        updateFleet: async (
            ownerId,
            changes
        ) => {

            const updated =
                await apiUpdateFleet(

                    ownerId,

                    changes

                );


            const normalizedFleet: Fleet = {

                ...updated,

                id:
                    Number(
                        updated.id
                    ),

                owner_id:
                    ownerId,

                T1:
                    Number(
                        updated.T1
                    ),

                T2:
                    Number(
                        updated.T2
                    ),

                T3:
                    Number(
                        updated.T3
                    ),

                S1:
                    Number(
                        updated.S1
                    ),

                S2:
                    Number(
                        updated.S2
                    ),

                S3:
                    Number(
                        updated.S3
                    )
            };


            set(
                state => ({

                    fleets: {

                        ...state.fleets,

                        [ownerId]:
                            normalizedFleet

                    }

                })
            );


            return normalizedFleet;

        },

        refreshFleet: async (
            ownerId
        ) => {

            return await get().loadFleet(
                ownerId
            );

        },


    }));