export interface HouseRequestUpdate {
    name: string;
    year: number | null;
    numberOfFlatsOnFloor: number | null;
}

export const createHouseRequestUpdate = (
    data: {
        name: string;
        year: number | null;
        numberOfFlatsOnFloor: number | null
    }
): HouseRequestUpdate => {
    return {
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const prepareHouseRequestUpdateForXml = (
    houseRequestUpdate: HouseRequestUpdate
): any => {
    return {
        name: houseRequestUpdate.name,
        year: houseRequestUpdate.year,
        numberOfFlatsOnFloor: houseRequestUpdate.numberOfFlatsOnFloor,
    };
};
