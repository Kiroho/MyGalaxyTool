import { Text } from "@react-three/drei";


const SIZE = 1521;


export default function CoordinateLabels() {

  const marks = [0, 500, 1000, 1500];


  return (
    <group>


      {/* X-Achse */}

      <Text
        position={[SIZE + 40, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={35}
        color="white"
      >
        X
      </Text>


      {marks.map((value) => (

        <Text
          key={`x-${value}`}
          position={[value, -40, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={20}
          color="#cccccc"
        >
          {value}
        </Text>

      ))}



      {/* Y-Achse */}

      <Text
        position={[0, SIZE + 40, 0]}
        fontSize={35}
        color="white"
      >
        Y
      </Text>


      {marks.map((value) => (

        <Text
          key={`y-${value}`}
          position={[-40, value, 0]}
          rotation={[0,0,0]}
          fontSize={20}
          color="#cccccc"
        >
          {value}
        </Text>

      ))}



      {/* Z-Achse */}

      <Text
        position={[0,0,SIZE + 40]}
        rotation={[Math.PI / 2,0,0]}
        fontSize={35}
        color="white"
      >
        Z
      </Text>


      {marks.map((value)=>(

        <Text
          key={`z-${value}`}
          position={[-40,0,value]}
          rotation={[Math.PI / 2,0,0]}
          fontSize={20}
          color="#cccccc"
        >
          {value}
        </Text>

      ))}


    </group>
  );
}