import { create } from "zustand";

type SensorStore = {
    sensorLevels: Record<string, number>;
    setSensorLevel: (planetId: string, level: number) => void;
    getSensorLevel: (planetId: string) => number;
};

export const useSensorStore = create<SensorStore>((set, get) => ({
    sensorLevels: {},

    setSensorLevel: (planetId, level) => {
        set(state => ({
            sensorLevels: {
                ...state.sensorLevels,
                [planetId]: Math.max(1, Math.min(20, level))
            }
        }));
    },

    getSensorLevel: planetId => {
        return get().sensorLevels[planetId] ?? 20;
    }
}));