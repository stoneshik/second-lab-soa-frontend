import type { BalconyType } from "~/types/BalconyType";
import { isValidPrice } from "./priceConvert";

export const validateFlatForm = (
    name: string | null,
    coordinatesX: number | null,
    coordinatesY: number | null,
    area: number | null,
    numberOfRooms: number | null,
    height: number | null,
    houseName: string | null,
    houseYear: number | null,
    houseNumberOfFlatsOnFloor: number | null,
    price: string | null,
    balconyType: BalconyType | null,
    walkingMinutesToMetro: number | null,
    transportMinutesToMetro: number | null
): string | null => {
    const validateNameResult = validateName(name);
    if (validateNameResult !== null) {
        return validateNameResult;
    }
    const validateCoordinatesResult = validateCoordinates(
        coordinatesX,
        coordinatesY
    );
    if (validateCoordinatesResult !== null) {
        return validateCoordinatesResult;
    }
    const validateAreaResult = validateArea(area);
    if (validateAreaResult !== null) {
        return validateAreaResult;
    }
    const validateNumberOfRoomsResult = validateNumberOfRooms(numberOfRooms);
    if (validateNumberOfRoomsResult !== null) {
        return validateNumberOfRoomsResult;
    }
    const validateHeightResult = validateHeight(height);
    if (validateHeightResult !== null) {
        return validateHeightResult;
    }
    const validateHouseResult = validateHouse(
        houseName,
        houseYear,
        houseNumberOfFlatsOnFloor
    );
    if (validateHouseResult !== null) {
        return validateHouseResult;
    }
    const validatePriceResult = validatePrice(price);
    if (validatePriceResult !== null) {
        return validatePriceResult;
    }
    if (balconyType === null) {
        return "Balcony type required";
    }
    const validateWalkingMinutesToMetroResult = validateWalkingMinutesToMetro(walkingMinutesToMetro);
    if (validateWalkingMinutesToMetroResult !== null) {
        return validateWalkingMinutesToMetroResult;
    }
    const validateTransportMinutesToMetroResult = validateTransportMinutesToMetro(transportMinutesToMetro);
    if (validateTransportMinutesToMetroResult !== null) {
        return validateTransportMinutesToMetroResult;
    }
    return null;
};

const validateName = (name: string | null): string | null => {
    if (name === null || name.trim().length === 0) {
        return "Name flat required";
    }
    return null;
};

const validateCoordinates = (
    coordinatesX: number | null,
    coordinatesY: number | null
): string | null => {
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
    return null;
};

const validateArea = (area: number | null): string | null => {
    if (area !== null && !Number.isInteger(area)) {
        return "Area must be integer";
    }
    if (area !== null && area <= 0) {
        return "Area must be greater than 0";
    }
    return null;
};

const validateNumberOfRooms = (numberOfRooms: number | null): string | null => {
    if (numberOfRooms === null) {
        return "Number of rooms required";
    }
    if (!Number.isInteger(numberOfRooms)) {
        return "Number of rooms must be integer";
    }
    if (numberOfRooms <= 0) {
        return "Number of rooms must be greater than 0";
    }
    return null;
};

const validateHeight = (height: number | null): string | null => {
    if (height === null) {
        return "Height required";
    }
    if (!Number.isInteger(height)) {
        return "Height must be integer";
    }
    if (height <= 0) {
        return "Height must be greater than 0";
    }
    return null;
};

const validateHouse = (
    houseName: string | null,
    houseYear: number | null,
    houseNumberOfFlatsOnFloor: number | null
): string | null => {
    if (houseName === null) {
        return "House name required";
    }
    if (houseYear !== null && !Number.isInteger(houseYear)) {
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

const validatePrice = (price: string | null): string | null => {
    if (price === null) {
        return "Price required";
    }
    if (!isValidPrice(price)) {
        return "Incorrect format price";
    }
    if (parseFloat(price) <= 0) {
        return "Price must be greater than 0";
    }
    return null;
};

const validateWalkingMinutesToMetro = (walkingMinutesToMetro: number| null): string | null => {
    if (walkingMinutesToMetro === null) {
        return "Walking minutes to metro required";
    }
    if (!Number.isInteger(walkingMinutesToMetro)) {
        return "Walking minutes to metro must be integer";
    }
    if (walkingMinutesToMetro <= 0) {
        return "Walking minutes to metro must be greater than 0";
    }
    return null;
};

const validateTransportMinutesToMetro = (transportMinutesToMetro: number| null): string | null => {
    if (transportMinutesToMetro === null) {
        return "Transport minutes to metro required";
    }
    if (!Number.isInteger(transportMinutesToMetro)) {
        return "Transport minutes to metro must be integer";
    }
    if (transportMinutesToMetro <= 0) {
        return "Transport minutes to metro must be greater than 0";
    }
    return null;
};
