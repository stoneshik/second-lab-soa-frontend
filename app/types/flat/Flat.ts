import { XMLBuilder, XMLParser } from "fast-xml-parser";
import {
    extractCoordinatesFromXml,
    isValidCoordinates,
    prepareCoordinatesForXml,
    type Coordinates
} from "../coordinates/Coordinates";
import {
    extractHouseFromXml,
    isValidHouse,
    prepareHouseForXml,
    type House
} from "../house/House";
import { parseTransport, Transport } from "../Transport";
import { parseView, View } from "../View";

export interface Flat {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: House;
}

export const createFlat = (
    data: {
        id: number,
        name: string,
        coordinates: Coordinates,
        creationDate: string,
        area: number | null,
        numberOfRooms: number,
        height: number,
        view: View | null,
        transport: Transport | null,
        house: House
    }
): Flat => {
    return {
        id: data.id,
        name: data.name,
        coordinates: data.coordinates,
        creationDate: data.creationDate,
        area: data.area,
        numberOfRooms: data.numberOfRooms,
        height: data.height,
        view: data.view,
        transport: data.transport,
        house: data.house,
    };
};

export const isValidFlat = (obj: unknown): obj is Flat => {
    if (!obj || typeof obj !== "object") return false;
    const flat = obj as Flat;
    if (
        typeof flat.id !== "number" ||
        typeof flat.name !== "string" ||
        typeof flat.creationDate !== "string" ||
        typeof flat.numberOfRooms !== "number" ||
        typeof flat.height !== "number"
    ) {
        return false;
    }
    if (!isValidCoordinates(flat.coordinates) || !isValidHouse(flat.house)) {
        return false;
    }
    if (flat.area !== null && typeof flat.area !== "number") return false;
    if (flat.view !== null && !Object.values(View).includes(flat.view)) return false;
    if (flat.transport !== null && !Object.values(Transport).includes(flat.transport)) return false;
    return true;
};

export const prepareFlatForXml = (flat: Flat): any => {
    const result: any = {
        flat: {
            id: flat.id,
            name: flat.name,
            coordinates: prepareCoordinatesForXml(flat.coordinates),
            creationDate: flat.creationDate,
            area: flat.area,
            numberOfRooms: flat.numberOfRooms,
            height: flat.height,
            view: flat.view,
            transport: flat.transport,
            house: prepareHouseForXml(flat.house)
        },
    };
    return result;
};

export const extractFlatFromXml = (xmlObject: any): Flat | null => {
    const flatData = xmlObject.flat || xmlObject;
    if (!flatData) return null;
    try {
        const coordinates = extractCoordinatesFromXml(flatData);
        const house = extractHouseFromXml(flatData);
        if (!coordinates || !house) {
            return null;
        }
        const flat = createFlat({
            id: Number(flatData.id),
            name: String(flatData.name),
            coordinates: coordinates,
            creationDate: String(flatData.creationDate),
            area: flatData.area == null ? null : Number(flatData.area),
            numberOfRooms: Number(flatData.numberOfRooms),
            height: Number(flatData.height),
            view: flatData.view == null ? null : parseView(flatData.view),
            transport: flatData.transport == null ? null : parseTransport(flatData.transport),
            house: house,
        });
        return isValidFlat(flat) ? flat : null;
    } catch {
        return null;
    }
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

const parser = new XMLParser(PARSER_CONFIG);
const builder = new XMLBuilder(PARSER_CONFIG);

export const parseFlatXml = (xml: string): Flat | null => {
    try {
        const parsed = parser.parse(xml);
        return extractFlatFromXml(parsed);
    } catch {
        return null;
    }
};

export const serializeFlatToXml = (flat: Flat): string => {
    const xmlObject = prepareFlatForXml(flat);
    return builder.build(xmlObject);
};
