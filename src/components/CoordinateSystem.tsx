import { Line } from "@react-three/drei";


const SIZE = 1521;
const STEP = 100;


type Point3D = [number, number, number];

type LineDefinition = [
  Point3D,
  Point3D
];


// Außenkanten des Würfels
function createEdges(): LineDefinition[] {

  return [

    // Untere Fläche
    [[0,0,0],[SIZE,0,0]],
    [[0,0,0],[0,SIZE,0]],
    [[0,0,0],[0,0,SIZE]],

    [[SIZE,SIZE,0],[SIZE,0,0]],
    [[SIZE,SIZE,0],[0,SIZE,0]],

    // Obere Fläche
    [[0,0,SIZE],[SIZE,0,SIZE]],
    [[0,0,SIZE],[0,SIZE,SIZE]],

    [[SIZE,SIZE,SIZE],[SIZE,0,SIZE]],
    [[SIZE,SIZE,SIZE],[0,SIZE,SIZE]],

    // Vertikale Verbindungen
    [[SIZE,0,0],[SIZE,0,SIZE]],
    [[0,SIZE,0],[0,SIZE,SIZE]],
    [[SIZE,SIZE,0],[SIZE,SIZE,SIZE]],

  ];

}



// Rasterlinien nur auf Außenflächen
function createGridLines(): LineDefinition[] {

  const lines: LineDefinition[] = [];


  for (let i = 0; i <= SIZE; i += STEP) {


    // Vorderseite Z = 0

    lines.push([
      [i,0,0],
      [i,SIZE,0]
    ]);

    lines.push([
      [0,i,0],
      [SIZE,i,0]
    ]);



    // Rückseite Z = SIZE

    lines.push([
      [i,0,SIZE],
      [i,SIZE,SIZE]
    ]);

    lines.push([
      [0,i,SIZE],
      [SIZE,i,SIZE]
    ]);



    // Linke Seite X = 0

    lines.push([
      [0,i,0],
      [0,i,SIZE]
    ]);

    lines.push([
      [0,0,i],
      [0,SIZE,i]
    ]);



    // Rechte Seite X = SIZE

    lines.push([
      [SIZE,i,0],
      [SIZE,i,SIZE]
    ]);

    lines.push([
      [SIZE,0,i],
      [SIZE,SIZE,i]
    ]);



    // Boden Y = 0

    lines.push([
      [i,0,0],
      [i,0,SIZE]
    ]);

    lines.push([
      [0,0,i],
      [SIZE,0,i]
    ]);



    // Decke Y = SIZE

    lines.push([
      [i,SIZE,0],
      [i,SIZE,SIZE]
    ]);

    lines.push([
      [0,SIZE,i],
      [SIZE,SIZE,i]
    ]);

  }


  return lines;

}



export default function CoordinateSystem() {


  const edges = createEdges();
  const gridLines = createGridLines();



  return (

    <group>


      {/* Würfelrahmen */}

      {edges.map((line,index)=>(

        <Line
          key={`edge-${index}`}
          points={line}
          color="#667788"
          lineWidth={1.5}
          depthTest={true}
        />

      ))}



      {/* Außenraster */}

      {gridLines.map((line,index)=>(

        <Line
          key={`grid-${index}`}
          points={line}
          color="#334455"
          lineWidth={0.5}
          depthTest={false}
        />

      ))}


    </group>

  );

}