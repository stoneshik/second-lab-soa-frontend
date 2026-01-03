export interface HouseRequestCreate {
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
}

export const createHouseRequestCreate = (
    data: { name: string; year: number; numberOfFlatsOnFloor: number }
): HouseRequestCreate => {
    return {
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const isValidHouseRequestCreate = (obj: unknown): obj is HouseRequestCreate => {
    if (!obj || typeof obj !== "object") return false;
    const house = obj as HouseRequestCreate;
    return (
        typeof house.name === "string" &&
        typeof house.year === "number" &&
        typeof house.numberOfFlatsOnFloor === "number"
    );
};
