import { XMLParser } from "fast-xml-parser";

export interface FlatGroupByHeight {
    height: number;
    count: number;
}

export interface FlatGroupsByHeightWrapper {
    groups: {
        group: FlatGroupByHeight[];
    };
}

export const createFlatGroupByHeight = (
    data: { height: number; count: number }
): FlatGroupByHeight => {
    return {
        height: data.height,
        count: data.count,
    };
};

export const isValidFlatGroupByHeight = (obj: unknown): obj is FlatGroupByHeight => {
    if (!obj || typeof obj !== "object") return false;
    const group = obj as FlatGroupByHeight;
    return (
        typeof group.height === "number" &&
        typeof group.count === "number"
    );
};

export const createFlatGroupsByHeightWrapper = (
    data: { groups: { group: FlatGroupByHeight[] } }
): FlatGroupsByHeightWrapper => {
    return {
        groups: {
            group: data.groups.group,
        },
    };
};

export const isValidFlatGroupsByHeightWrapper = (obj: unknown): obj is FlatGroupsByHeightWrapper => {
    if (!obj || typeof obj !== "object") return false;
    const wrapper = obj as FlatGroupsByHeightWrapper;
    if (!wrapper.groups || typeof wrapper.groups !== "object") {
        return false;
    }
    if (!Array.isArray(wrapper.groups.group)) {
        return false;
    }
    return wrapper.groups.group.every(group => isValidFlatGroupByHeight(group));
};

export const extractFlatGroupByHeightFromXml = (xmlObject: any): FlatGroupByHeight | null => {
    const groupData = xmlObject.group || xmlObject;
    if (!groupData) return null;
    try {
        const group = createFlatGroupByHeight({
            height: Number(groupData.height),
            count: Number(groupData.count),
        });
        return isValidFlatGroupByHeight(group) ? group : null;
    } catch {
        return null;
    }
};

export const extractFlatGroupsByHeightWrapperFromXml = (xmlObject: any): FlatGroupsByHeightWrapper | null => {
    const wrapperData = xmlObject.groupsWrapper || xmlObject.groups || xmlObject;
    if (!wrapperData) return null;
    try {
        let groups: FlatGroupByHeight[] = [];
        if (wrapperData.groups) {
            const groupsData = wrapperData.groups;
            // Вариант 1: groups содержит массив group
            if (groupsData.group && Array.isArray(groupsData.group)) {
                groups = groupsData.group
                    .map((groupObj: any) => extractFlatGroupByHeightFromXml(groupObj))
                    .filter((group: FlatGroupByHeight | null): group is FlatGroupByHeight => group !== null);
            }
            // Вариант 2: groups уже массив group
            else if (Array.isArray(groupsData)) {
                groups = groupsData
                    .map((groupObj: any) => extractFlatGroupByHeightFromXml(groupObj))
                    .filter((group: FlatGroupByHeight | null): group is FlatGroupByHeight => group !== null);
            }
            // Вариант 3: всего один group
            else if (groupsData.group && !Array.isArray(groupsData.group)) {
                const group = extractFlatGroupByHeightFromXml(groupsData.group);
                if (group) groups = [group];
            }
        }
        const wrapper = createFlatGroupsByHeightWrapper({
            groups: { group: groups },
        });
        return isValidFlatGroupsByHeightWrapper(wrapper) ? wrapper : null;
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
    isArray: (name: string) => name === "group",
} as const;

const parser = new XMLParser(PARSER_CONFIG);

export const parseFlatGroupByHeightXml = (xml: string): FlatGroupByHeight | null => {
    try {
        const parsed = parser.parse(xml);
        return extractFlatGroupByHeightFromXml(parsed);
    } catch {
        return null;
    }
};

export const parseFlatGroupsByHeightWrapperXml = (xml: string): FlatGroupsByHeightWrapper | null => {
    try {
        const parsed = parser.parse(xml);
        return extractFlatGroupsByHeightWrapperFromXml(parsed);
    } catch {
        return null;
    }
};
