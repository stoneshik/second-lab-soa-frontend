export interface House {
    id: number;
    name: string;
    year: number | null;
    numberOfFlatsOnFloor: number | null;
}

export const createHouse = (
    data: {
        id: number,
        name: string;
        year: number | null;
        numberOfFlatsOnFloor: number | null
    }
): House => {
    return {
        id: data.id,
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const isValidHouse = (obj: unknown): boolean => {
    if (!obj || typeof obj !== "object") return false;
    const house = obj as House;
    if (
        typeof house.id !== "number" ||
        typeof house.name !== "string"
    ) {
        return false;
    }
    if (house.year !== null && typeof house.year !== "number") return false;
    if (house.numberOfFlatsOnFloor !== null && typeof house.numberOfFlatsOnFloor !== "number") return false;
    return true;
};

export const extractHouseFromXml = (xmlObject: any): House | null => {
    const houseData = xmlObject.house || xmlObject;
    if (!houseData) return null;
    try {
        const house = createHouse({
            id: Number(houseData.id),
            name: String(houseData.name),
            year: houseData.year == null ? null : Number(houseData.year),
            numberOfFlatsOnFloor: houseData.numberOfFlatsOnFloor == null ?
                null : Number(houseData.numberOfFlatsOnFloor),
        });
        return isValidHouse(house) ? house : null;
    } catch {
        return null;
    }
};
