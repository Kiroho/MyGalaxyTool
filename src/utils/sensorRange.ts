export const SENSOR_RANGES = [
    5, 18, 41, 72, 113,
    162, 221, 288, 365, 450,
    545, 648, 761, 882, 1013,
    1152, 1301, 1458, 1625, 1800
] as const;

export function getSensorRange(level: number): number {
    const index = Math.max(
        0,
        Math.min(19, Math.round(level) - 1)
    );

    return SENSOR_RANGES[index];
}

export function getSensorRadius(level: number): number {
    return getSensorRange(level) / 12;
}