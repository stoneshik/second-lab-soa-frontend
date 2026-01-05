import { XMLParser } from "fast-xml-parser";
import { BalconyType } from "../BalconyType";
import {
    extractCoordinatesFromXml,
    isValidCoordinates,
    type Coordinates
} from "../coordinates/Coordinates";
import {
    extractHouseFromXml,
    isValidHouse,
    type House
} from "../house/House";
import { parseTransport, Transport } from "../Transport";
import { parseView, View } from "../View";
import { convertPriceNumberToString } from "~/utils/priceConvert";

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
    price: string;
    balconyType: BalconyType;
    walkingMinutesToMetro: number;
    transportMinutesToMetro: number;
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
        house: House,
        price: string,
        balconyType: BalconyType,
        walkingMinutesToMetro: number,
        transportMinutesToMetro: number,
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
        price: data.price,
        balconyType: data.balconyType,
        walkingMinutesToMetro: data.walkingMinutesToMetro,
        transportMinutesToMetro: data.transportMinutesToMetro,
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
        typeof flat.height !== "number" ||
        !Object.values(BalconyType).includes(flat.balconyType) ||
        typeof flat.walkingMinutesToMetro !== "number" ||
        typeof flat.transportMinutesToMetro !== "number"
    ) {
        return false;
    }
    if (!isValidCoordinates(flat.coordinates) || !isValidHouse(flat.house)) {
        return false;
    }
    if (typeof flat.price !== "string" && convertPriceNumberToString(flat.price) === null) return false;
    if (flat.area !== null && typeof flat.area !== "number") return false;
    if (flat.view !== null && !Object.values(View).includes(flat.view)) return false;
    if (flat.transport !== null && !Object.values(Transport).includes(flat.transport)) return false;
    return true;
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
            area: !flatData.area ? null : Number(flatData.area),
            numberOfRooms: Number(flatData.numberOfRooms),
            height: Number(flatData.height),
            view: flatData.view === null ? null : parseView(flatData.view),
            transport: flatData.transport === null ? null : parseTransport(flatData.transport),
            house: house,
            price: convertPriceNumberToString(flatData.price),
            balconyType: flatData.balconyType,
            walkingMinutesToMetro: flatData.walkingMinutesToMetro,
            transportMinutesToMetro: flatData.transportMinutesToMetro,
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

export const parseFlatXml = (xml: string): Flat | null => {
    try {
        const parsed = parser.parse(xml);
        return extractFlatFromXml(parsed);
    } catch {
        return null;
    }
};
