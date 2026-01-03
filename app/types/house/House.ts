import { XMLParser, XMLBuilder } from "fast-xml-parser";

export interface House {
    id: number;
    name: string;
    year: number;
    numberOfFlatsOnFloor: number;
}

export const createHouse = (
    data: { id: number, name: string; year: number; numberOfFlatsOnFloor: number }
): House => {
    return {
        id: data.id,
        name: data.name,
        year: data.year,
        numberOfFlatsOnFloor: data.numberOfFlatsOnFloor,
    };
};

export const isValidHouse = (obj: unknown): obj is House => {
    if (!obj || typeof obj !== "object") return false;
    const house = obj as House;
    return (
        typeof house.id === "number" &&
        typeof house.name === "string" &&
        typeof house.year === "number" &&
        typeof house.numberOfFlatsOnFloor === "number"
    );
};

export const prepareHouseForXml = (house: House): any => {
    return {
        house: {
            id: house.id,
            name: house.name,
            year: house.year,
            numberOfFlatsOnFloor: house.numberOfFlatsOnFloor,
        }
    };
};

export const extractHouseFromXml = (xmlObject: any): House | null => {
    const houseData = xmlObject.house || xmlObject;
    if (!houseData) return null;
    try {
        const house = createHouse({
            id: Number(houseData.id) || 0,
            name: String(houseData.name || ""),
            year: Number(houseData.year) || 0,
            numberOfFlatsOnFloor: Number(houseData.numberOfFlatsOnFloor) || 0,
        });
        return isValidHouse(house) ? house : null;
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
} as const;

const parser = new XMLParser(PARSER_CONFIG);
const builder = new XMLBuilder(PARSER_CONFIG);

export const parseHouseXml = (xml: string): House | null => {
    try {
        const parsed = parser.parse(xml);
        return extractHouseFromXml(parsed);
    } catch {
        return null;
    }
};

export const serializeHouseToXml = (house: House): string => {
    const xmlObject = prepareHouseForXml(house);
    return builder.build(xmlObject);
};
