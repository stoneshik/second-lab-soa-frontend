
export const validateFlatForm = (
    name: string,
    coordinatesX: number,
    coordinatesY: number,
    area: number | null,
    numberOfRooms: number,
    height: number,
    houseName: string,
    houseYear: number | null,
    houseNumberOfFlatsOnFloor: number | null
): string | null => {
    if (name === null || name.trim().length === 0) {
        return "Name flat required";
    }
    if (coordinatesX === null || coordinatesY == null) {
        return "Coordinates of flat required";
    }
    if (coordinatesX <= -993) {
        return "Coordinate x must be greater than -993";
    }
    if (!Number.isFinite(coordinatesX)) {
        return "Coordinate x must be finite";
    }
    if (!Number.isInteger(coordinatesY)) {
        return "Coordinate y must be integer";
    }
    if (area !== null && !Number.isInteger(area)) {
        return "Area must be integer";
    }
    if (area !== null && area <= 0) {
        return "Area must be greater than 0";
    }
    if (numberOfRooms === null) {
        return "Number of rooms required";
    }
    if (!Number.isInteger(numberOfRooms)) {
        return "Number of rooms must be integer";
    }
    if (numberOfRooms <= 0) {
        return "Number of rooms must be greater than 0";
    }
    if (height === null) {
        return "Height required";
    }
    if (!Number.isInteger(height)) {
        return "Height must be integer";
    }
    if (height <= 0) {
        return "Height must be greater than 0";
    }
    if (houseName === null) {
        return "House name required";
    }
    if (houseYear !== null && !Number.isInteger(height)) {
        return "House year must be integer";
    }
    if (houseYear !== null && houseYear <= 0) {
        return "House year must be greater than 0";
    }
    if (houseNumberOfFlatsOnFloor !== null && !Number.isInteger(houseNumberOfFlatsOnFloor)) {
        return "House number of flats on floor must be integer";
    }
    if (houseNumberOfFlatsOnFloor !== null && houseNumberOfFlatsOnFloor <= 0) {
        return "House number of flats on floor must be greater than 0";
    }
    return null;
};
