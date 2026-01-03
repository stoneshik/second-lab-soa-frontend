import { XMLBuilder, XMLParser } from "fast-xml-parser";

export interface Coordinates {
    id: number;
    x: number;
    y: number;
}

export const createCoordinates = (
    data: { id: number, x: number; y: number }
): Coordinates => {
    return {
        id: data.id,
        x: data.x,
        y: data.y,
    };
};

export const isValidCoordinates = (obj: unknown): obj is Coordinates => {
    if (!obj || typeof obj !== "object") return false;
    const coords = obj as Coordinates;
    return (
        typeof coords.id === "number" &&
        typeof coords.x === "number" &&
        typeof coords.y === "number"
    );
};

export const prepareCoordinatesForXml = (coordinates: Coordinates): any => {
    return {
        coordinates: {
            id: coordinates.id,
            x: coordinates.x,
            y: coordinates.y,
        }
    };
};

export const extractCoordinatesFromXml = (xmlObject: any): Coordinates | null => {
    const coordsData = xmlObject.coordinates || xmlObject;
    if (!coordsData) return null;
    try {
        const coordinates = createCoordinates({
            id: Number(coordsData.id),
            x: Number(coordsData.x),
            y: Number(coordsData.y),
        });
        return isValidCoordinates(coordinates) ? coordinates : null;
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

export const parseCoordinatesXml = (xml: string): Coordinates | null => {
    try {
        const parsed = parser.parse(xml);
        return extractCoordinatesFromXml(parsed);
    } catch {
        return null;
    }
};

export const serializeCoordinatesToXml = (coordinates: Coordinates): string => {
    const xmlObject = prepareCoordinatesForXml(coordinates);
    return builder.build(xmlObject);
};
