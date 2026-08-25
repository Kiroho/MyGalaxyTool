import type { Fleet } from "../store/fleetStore";
import fleetUnits from "../data/fleetUnits.json";


export function calculateFleetDamage(
    fleet: Fleet,
    volk: string
) {

    let attack = 0;

    let buildingAttack = 0;


    Object.keys(fleetUnits).forEach(
        unitId => {

            const count =
                fleet[
                    unitId as keyof Fleet
                ];


            if(
                typeof count !== "number"
            )
                return;


            const unit =
                fleetUnits[
                    unitId as keyof typeof fleetUnits
                ];


            const values =
                unit[
                    volk as keyof typeof unit
                ];


            if(!values)
                return;


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