export type Planet = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  type: "main" | "planet" | "kolo" | "sensor";
};


export const planets: Planet[] = [
  {
    id: "main",
    name: "Main",
    x: 761,
    y: 761,
    z: 761,
    color: "#ffd166",
    type: "main",
  },
];