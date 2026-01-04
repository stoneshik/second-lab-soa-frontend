import { XMLBuilder } from "fast-xml-parser";
import { type CoordinatesRequestUpdate } from "../coordinates/CoordinatesRequestUpdate";
import { type HouseRequestUpdate } from "../house/HouseRequestUpdate";
import type { Transport } from "../Transport";
import type { View } from "../View";

export interface FlatRequestUpdate {
    name: string;
    coordinates: CoordinatesRequestUpdate;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: HouseRequestUpdate;
}

export const createFlatRequestUpdate = (
    data: {
        name: string,
        coordinates: CoordinatesRequestUpdate,
        area: number | null,
        numberOfRooms: number,
        height: number,
        view: View | null,
        transport: Transport | null,
        house: HouseRequestUpdate
    }
): FlatRequestUpdate => {
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

export const prepareFlatRequestUpdateForXml = (flatRequestUpdate: FlatRequestUpdate): any => {
    const result: any = {
        flat: {
            name: flatRequestUpdate.name,
            coordinates: flatRequestUpdate.coordinates,
            area: flatRequestUpdate.area,
            numberOfRooms: flatRequestUpdate.numberOfRooms,
            height: flatRequestUpdate.height,
            view: flatRequestUpdate.view,
            transport: flatRequestUpdate.transport,
            house: flatRequestUpdate.house
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

export const serializeFlatRequestUpdateToXml = (flatRequestUpdate: FlatRequestUpdate): string => {
    const xmlObject = prepareFlatRequestUpdateForXml(flatRequestUpdate);
    return builder.build(xmlObject);
};
