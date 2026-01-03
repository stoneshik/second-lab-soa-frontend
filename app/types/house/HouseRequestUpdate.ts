export interface HouseRequestUpdate {
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
}

export const createHouseRequestUpdate = (
    data: { name: string; year: number; numberOfFlatsOnFloor: number }
): HouseRequestUpdate => {
    return {
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const isValidHouseRequestUpdate = (obj: unknown): obj is HouseRequestUpdate => {
    if (!obj || typeof obj !== "object") return false;
    const house = obj as HouseRequestUpdate;
    return (
        typeof house.name === "string" &&
        typeof house.year === "number" &&
        typeof house.numberOfFlatsOnFloor === "number"
    );
};
