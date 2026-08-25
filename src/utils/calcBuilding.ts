export function calculateBuildingHp(
    level: number
): number {

    return Math.round(
        2512 *
        Math.pow(1.2, level)
    );

}


export function calculateBuildingTotalHp(
    level: number
): number {

    let total = 0;

    for(let i = 1; i <= level; i++){

        total +=
            calculateBuildingHp(i);

    }

    return Math.round(total);

}