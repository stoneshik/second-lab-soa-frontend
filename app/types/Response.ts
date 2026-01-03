import { XMLParser } from "fast-xml-parser";

export interface MyResponse {
    value: number;
}

export const createResponse = (
    data: { value: number }
): MyResponse => {
    return {
        value: data.value
    };
};

export const isValidMyResponse = (obj: unknown): boolean => {
    if (!obj || typeof obj !== "object") return false;
    const response = obj as MyResponse;
    return (
        typeof response.value === "number"
    );
};

export const extractMyResponseFromXml = (xmlObject: any): MyResponse | null => {
    const responseData = xmlObject.response || xmlObject;
    if (!responseData) return null;
    try {
        const value = createResponse({
            value: Number(responseData.value),
        });
        return isValidMyResponse(value) ? value : null;
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

export const parseMyResponseXml = (xml: string): MyResponse | null => {
    try {
        const parsed = parser.parse(xml);
        return extractMyResponseFromXml(parsed);
    } catch {
        return null;
    }
};
