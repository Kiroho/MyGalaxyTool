type Point3D = {

x:number;
y:number;
z:number;

};

function distance(
a:Point3D,
b:Point3D
){

const dx = a.x - b.x;
const dy = a.y - b.y;
const dz = a.z - b.z;

return Math.sqrt(
dx*dx +
dy*dy +
dz*dz
);

}

/*
Gleichmäßig verteilte Punkte
auf einer Kugeloberfläche
*/

function fibonacciDirection(
index:number,
count:number
):Point3D{

if(count <= 1){

return {

x:1,
y:0,
z:0

};

}

const goldenAngle =
Math.PI *
(3 - Math.sqrt(5));

const y =
1 -
(index / (count - 1)) * 2;

const radius =
Math.sqrt(
1 - y*y
);

const theta =
goldenAngle *
index;

return {

x:
Math.cos(theta) *
radius,

y,

z:
Math.sin(theta) *
radius

};

}

export function calculateSensorPosition(

startPlanet:Point3D,

planets:Point3D[],

radius:number

):Point3D {

const candidates = 10000;

const maxRounds = 3;

const relaxationStep = 0.05;

/*
Mehrere Suchrunden

Runde 0:
voller Abstand

Runde 5:
50% Abstand

*/



for(
let round = 0;
round <= maxRounds;
round++
){

const minimumDistance =
radius *
(1 - round * relaxationStep);

console.log(
"Sensor Suche Runde:",
round,
"Mindestabstand:",
minimumDistance
);

let bestPoint:Point3D | null = null;

let bestScore = -Infinity;

for(
let i = 0;
i < candidates;
i++
){

const dir =
fibonacciDirection(
i,
candidates
);

/*
Kandidat bleibt immer
exakt auf der Kugel
um den Startplaneten

*/

const candidate:Point3D = {

x:
startPlanet.x +
dir.x *
radius,

y:
startPlanet.y +
dir.y *
radius,

z:
startPlanet.z +
dir.z *
radius

};


let score = 0;

let invalid = false;






for(
const planet of planets
){

/*
Startplanet ignorieren

*/

if(

planet.x === startPlanet.x &&
planet.y === startPlanet.y &&
planet.z === startPlanet.z

){

continue;

}

const d =
distance(
candidate,
planet
);

/*
Mindestabstand
dieser Runde

*/

if(
d < minimumDistance
){

invalid = true;

break;

}





/*
Je näher an der Grenze,
desto besser

*/

const difference =
Math.abs(
d - minimumDistance
);

score +=
10000 -
difference;

/*
leichte Bevorzugung
von Clustern

*/

if(
d <= minimumDistance * 1.5
){

score += 1000;

}

}

if(invalid)
continue;

if(
score > bestScore
){

bestScore = score;

bestPoint = candidate;

}

}

/*
Diese Runde war erfolgreich

*/

if(bestPoint && bestPoint.x > 0 && bestPoint.y > 0 && bestPoint.z > 0){

    return bestPoint;

}

}
const fallback:Point3D = {

x:0,

y:0,

z:0

};
return fallback
//throw new Error(
//"Keine gültige Sensorposition gefunden."
//);

}