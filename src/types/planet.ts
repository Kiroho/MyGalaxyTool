export type Planet = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  type: "main" | "planet" | "kolo" | "sensor";
  owner: string;
};