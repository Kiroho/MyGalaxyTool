export function xyzToAddress(
    x: number,
    y: number,
    z: number
): string {

    /*
        Format:

        X-Block.Y-Block.Z-Block.Z-Position.Y-Position.X-Position
    */


    const A = Math.ceil(x / 39);
    const B = Math.ceil(y / 39);
    const C = Math.ceil(z / 39);


    const D = Math.abs((C - 1) * 39 - z);
    const E = Math.abs((B - 1) * 39 - y);
    const F = Math.abs((A - 1) * 39 - x);


    return `${A}.${B}.${C}.${D}.${E}.${F}`;

}





export function isValidAddress(
    address: string
): boolean {


    const parts = address.split(".");


    // genau 6 Werte erforderlich
    if(parts.length !== 6)
        return false;



    const values = parts.map(Number);



    // nur Zahlen erlaubt
    if(
        values.some(
            value => isNaN(value)
        )
    )
        return false;



    // Werte müssen zwischen 1 und 39 liegen
    if(
        values.some(
            value =>
                value < 1 ||
                value > 39
        )
    )
        return false;



    // jeder Wert darf nur einmal vorkommen
    const uniqueValues =
        new Set(values);


    if(
        uniqueValues.size !== 6
    )
        return false;



    return true;

}





export function addressToXYZ(
    address: string
)
{
    const parts = address
        .split(".")
        .map(Number);


    if(parts.length !== 6)
    {
        return null;
    }


    const [
        A,
        B,
        C,
        D,
        E,
        F

    ] = parts;


    if(
        !Number.isInteger(A) ||
        !Number.isInteger(B) ||
        !Number.isInteger(C) ||
        !Number.isInteger(D) ||
        !Number.isInteger(E) ||
        !Number.isInteger(F)
    )
    {
        return null;
    }


    const x =
        (A - 1) * 39 + F;


    const y =
        (B - 1) * 39 + E;


    const z =
        (C - 1) * 39 + D;


    return {

        x,

        y,

        z

    };

}