import { defaultPlanets } from "../data/defaultPlanets";
import type { Planet } from "../types/planet";


export async function getPlanets(): Promise<Planet[]> {

    return defaultPlanets;

}