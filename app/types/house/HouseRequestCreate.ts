export interface HouseRequestCreate {
    name: string;
    year: number | null;
    numberOfFlatsOnFloor: number | null;
}

export const createHouseRequestCreate = (
    data: {
        name: string;
        year: number | null;
        numberOfFlatsOnFloor: number | null
    }
): HouseRequestCreate => {
    return {
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const prepareHouseRequestCreateForXml = (
    houseRequestCreate: HouseRequestCreate
): any => {
    return {
        house: {
            name: houseRequestCreate.name,
            year: houseRequestCreate.year,
            numberOfFlatsOnFloor: houseRequestCreate.numberOfFlatsOnFloor,
        }
    };
};
