export interface CoordinatesRequestUpdate {
    x: number;
    y: number;
}

export const createCoordinatesRequestUpdate = (
    data: { x: number; y: number }
): CoordinatesRequestUpdate => {
    return {
        x: data.x,
        y: data.y,
    };
};

export const prepareCoordinatesRequestUpdateForXml = (
    coordinatesRequestUpdate: CoordinatesRequestUpdate
): any => {
    return {
        x: coordinatesRequestUpdate.x,
        y: coordinatesRequestUpdate.y,
    };
};
