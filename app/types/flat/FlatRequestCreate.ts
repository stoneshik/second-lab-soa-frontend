import { XMLBuilder } from "fast-xml-parser";
import { prepareCoordinatesRequestCreateForXml, type CoordinatesRequestCreate } from "../coordinates/CoordinatesRequestCreate";
import { prepareHouseRequestCreateForXml, type HouseRequestCreate } from "../house/HouseRequestCreate";
import type { Transport } from "../Transport";
import type { View } from "../View";

export interface FlatRequestCreate {
    name: string;
    coordinates: CoordinatesRequestCreate;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: HouseRequestCreate;
}

export const createFlatRequestCreate = (
    data: {
        name: string,
        coordinates: CoordinatesRequestCreate,
        area: number | null,
        numberOfRooms: number,
        height: number,
        view: View | null,
        transport: Transport | null,
        house: HouseRequestCreate
    }
): FlatRequestCreate => {
    return {
        name: data.name,
        coordinates: data.coordinates,
        area: data.area,
        numberOfRooms: data.numberOfRooms,
        height: data.height,
        view: data.view,
        transport: data.transport,
        house: data.house,
    };
};

export const prepareFlatRequestCreateForXml = (flatRequestCreate: FlatRequestCreate): any => {
    const result: any = {
        flat: {
            name: flatRequestCreate.name,
            coordinates: prepareCoordinatesRequestCreateForXml(flatRequestCreate.coordinates),
            area: flatRequestCreate.area,
            numberOfRooms: flatRequestCreate.numberOfRooms,
            height: flatRequestCreate.height,
            view: flatRequestCreate.view,
            transport: flatRequestCreate.transport,
            house: prepareHouseRequestCreateForXml(flatRequestCreate.house)
        },
    };
    return result;
};

const PARSER_CONFIG = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    processEntities: false,
    isArray: () => false,
} as const;

const builder = new XMLBuilder(PARSER_CONFIG);

export const serializeFlatRequestCreateToXml = (flatRequestCreate: FlatRequestCreate): string => {
    const xmlObject = prepareFlatRequestCreateForXml(flatRequestCreate);
    return builder.build(xmlObject);
};
