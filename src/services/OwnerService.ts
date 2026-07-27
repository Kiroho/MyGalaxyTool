import { defaultOwners } from "../data/defaultOwners";
import type { Owner } from "../types/owner";


export async function getOwners(): Promise<Owner[]> {

    return defaultOwners;

}