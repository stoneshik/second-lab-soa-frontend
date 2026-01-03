import { XMLParser } from "fast-xml-parser";
import { extractFlatFromXml, isValidFlat, type Flat } from "./Flat";

export interface WrapperListFlats {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    flats: Flat[];
}

export const createWrapperListFlats = (
    data: {
        totalElements: number,
        totalPages: number,
        currentPage: number,
        pageSize: number,
        flats: Flat[]
    }
): WrapperListFlats => {
    return {
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        flats: data.flats,
    };
};

export const isValidWrapperListFlats = (obj: unknown): boolean => {
    if (!obj || typeof obj !== "object") return false;
    const wrapper = obj as WrapperListFlats;
    if (
        typeof wrapper.totalElements !== "number" ||
        typeof wrapper.totalPages !== "number" ||
        typeof wrapper.currentPage !== "number" ||
        typeof wrapper.pageSize !== "number"
    ) {
        return false;
    }
    if (!Array.isArray(wrapper.flats)) return false;
    if (!wrapper.flats.every(flat => isValidFlat(flat))) {
        return false;
    }
    return true;
};

export const extractWrapperListFlatsFromXml = (xmlObject: any): WrapperListFlats | null => {
    const wrapperData = xmlObject.wrapperListFlats || xmlObject;
    if (!wrapperData) return null;
    try {
        let flats: Flat[] = [];
        if (wrapperData.flats) {
            const flatsData = wrapperData.flats;
            // Вариант 1: flats содержит массив flat
            if (flatsData.flat && Array.isArray(flatsData.flat)) {
                flats = flatsData.flat
                    .map((flatObj: any) => extractFlatFromXml(flatObj))
                    .filter((flat: Flat | null): flat is Flat => flat !== null);
            }
            // Вариант 2: flats уже массив flat
            else if (Array.isArray(flatsData)) {
                flats = flatsData
                    .map((flatObj: any) => extractFlatFromXml(flatObj))
                    .filter((flat: Flat | null): flat is Flat => flat !== null);
            }
            // Вариант 3: всего один flat
            else if (flatsData.flat && !Array.isArray(flatsData.flat)) {
                const flat = extractFlatFromXml(flatsData.flat);
                if (flat) flats = [flat];
            }
        }
        const wrapper = createWrapperListFlats({
            totalElements: Number(wrapperData.totalElements),
            totalPages: Number(wrapperData.totalPages),
            currentPage: Number(wrapperData.currentPage),
            pageSize: Number(wrapperData.pageSize),
            flats,
        });
        return isValidWrapperListFlats(wrapper) ? wrapper : null;
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
    isArray: (name: string) => name === "flat",
} as const;

const parser = new XMLParser(PARSER_CONFIG);

export const parseWrapperListFlatsXml = (xml: string): WrapperListFlats | null => {
    try {
        const parsed = parser.parse(xml);
        return extractWrapperListFlatsFromXml(parsed);
    } catch {
        return null;
    }
};
