export type Volk =
    | "Tau'ri"
    | "Goa'uld"
    | "Wraith"
    | "Replikator";

export type Owner = {
    id: string;
    name: string;
    color: string;
    volk: Volk;
};



export const volkList: Volk[] = [
    "Tau'ri",
    "Goa'uld",
    "Wraith",
    "Replikator"
];