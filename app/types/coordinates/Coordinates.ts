export interface Coordinates {
    id: number;
    x: number;
    y: number;
}

export const createCoordinates = (
    data: { id: number, x: number; y: number }
): Coordinates => {
    return {
        id: data.id,
        x: data.x,
        y: data.y,
    };
};

export const isValidCoordinates = (obj: unknown): boolean => {
    if (!obj || typeof obj !== "object") return false;
    const coords = obj as Coordinates;
    return (
        typeof coords.id === "number" &&
        typeof coords.x === "number" &&
        typeof coords.y === "number"
    );
};

export const extractCoordinatesFromXml = (xmlObject: any): Coordinates | null => {
    const coordsData = xmlObject.coordinates || xmlObject;
    if (!coordsData) return null;
    try {
        const coordinates = createCoordinates({
            id: Number(coordsData.id),
            x: Number(coordsData.x),
            y: Number(coordsData.y),
        });
        return isValidCoordinates(coordinates) ? coordinates : null;
    } catch {
        return null;
    }
};
