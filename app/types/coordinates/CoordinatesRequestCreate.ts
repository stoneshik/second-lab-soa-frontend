export interface CoordinatesRequestCreate {
    x: number;
    y: number;
}

export const createCoordinatesRequestCreate = (
    data: { x: number; y: number }
): CoordinatesRequestCreate => {
    return {
        x: data.x,
        y: data.y,
    };
};

export const prepareCoordinatesRequestCreateForXml = (
    coordinatesRequestCreate: CoordinatesRequestCreate
): any => {
    return {
        x: coordinatesRequestCreate.x,
        y: coordinatesRequestCreate.y,
    };
};
