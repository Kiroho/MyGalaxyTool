export function xyzToAddress(
    x:number,
    y:number,
    z:number
):string {

    const A = Math.ceil(x / 39);
    const B = Math.ceil(y / 39);
    const C = Math.ceil(z / 39);

    const D = Math.abs((C - 1) * 39 - z);
    const E = Math.abs((B - 1) * 39 - y);
    const F = Math.abs((A - 1) * 39 - x);


    return `${A}.${B}.${C}.${D}.${E}.${F}`;

}



export function addressToXYZ(
    address:string
):
{
    x:number;
    y:number;
    z:number;
}
| null {


    try {

        const parts = address.split(".");


        if(parts.length !== 6)
            return null;


        const [
            A,
            B,
            C,
            D,
            E,
            F
        ] = parts.map(Number);



        if(
            parts.some(
                value => isNaN(Number(value))
            )
        )
            return null;



        return {

            x:Math.abs((A - 1) * 39 - F),

            y:Math.abs((B - 1) * 39 - E),

            z:Math.abs((C - 1) * 39 - D)

        };


    }
    catch {

        return null;

    }

}