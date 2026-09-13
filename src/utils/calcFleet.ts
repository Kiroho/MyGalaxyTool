import type { Fleet } from "../store/fleetStore";
import fleetUnits from "../data/fleetUnits.json";

type FleetValues = {
    T1: number;
    T2: number;
    T3: number;
    S1: number;
    S2: number;
    S3: number;
};

export function calculateFleetDamage(
    fleet: Fleet | FleetValues,
    volk: string
) {
    let attack = 0;
    let buildingAttack = 0;

    Object.keys(fleetUnits).forEach(
        unitId => {
            const count =
                fleet[
                    unitId as keyof typeof fleetUnits
                ];

            if(
                typeof count !== "number"
            ){
                return;
            }

            const unit =
                fleetUnits[
                    unitId as keyof typeof fleetUnits
                ];

            const values =
                unit[
                    volk as keyof typeof unit
                ];

            if(!values){
                return;
            }

            attack +=
                count *
                values.attack;

            buildingAttack +=
                count *
                values.buildingAttack;
        }
    );

    return {
        attack,
        buildingAttack
    };
}