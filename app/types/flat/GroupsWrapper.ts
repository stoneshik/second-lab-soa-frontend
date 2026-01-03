import { XMLParser } from "fast-xml-parser";

export interface Group {
    height: number;
    count: number;
}

export interface GroupsWrapper {
    groups: {
        group: Group[];
    };
}

export const createGroup = (
    data: { height: number; count: number }
): Group => {
    return {
        height: data.height,
        count: data.count,
    };
};

export const isValidGroup = (obj: unknown): obj is Group => {
    if (!obj || typeof obj !== "object") return false;
    const group = obj as Group;
    return (
        typeof group.height === "number" &&
        typeof group.count === "number"
    );
};

export const createGroupsWrapper = (
    data: { groups: { group: Group[] } }
): GroupsWrapper => {
    return {
        groups: {
            group: data.groups.group,
        },
    };
};

export const isValidGroupsWrapper = (obj: unknown): obj is GroupsWrapper => {
    if (!obj || typeof obj !== "object") return false;
    const wrapper = obj as GroupsWrapper;
    if (!wrapper.groups || typeof wrapper.groups !== "object") {
        return false;
    }
    if (!Array.isArray(wrapper.groups.group)) {
        return false;
    }
    return wrapper.groups.group.every(group => isValidGroup(group));
};

export const extractGroupFromXml = (xmlObject: any): Group | null => {
    const groupData = xmlObject.group || xmlObject;
    if (!groupData) return null;
    try {
        const group = createGroup({
            height: Number(groupData.height),
            count: Number(groupData.count),
        });
        return isValidGroup(group) ? group : null;
    } catch {
        return null;
    }
};

export const extractGroupsWrapperFromXml = (xmlObject: any): GroupsWrapper | null => {
    const wrapperData = xmlObject.groupsWrapper || xmlObject.groups || xmlObject;
    if (!wrapperData) return null;
    try {
        let groups: Group[] = [];
        if (wrapperData.groups) {
            const groupsData = wrapperData.groups;
            // Вариант 1: groups содержит массив group
            if (groupsData.group && Array.isArray(groupsData.group)) {
                groups = groupsData.group
                    .map((groupObj: any) => extractGroupFromXml(groupObj))
                    .filter((group: Group | null): group is Group => group !== null);
            }
            // Вариант 2: groups уже массив group
            else if (Array.isArray(groupsData)) {
                groups = groupsData
                    .map((groupObj: any) => extractGroupFromXml(groupObj))
                    .filter((group: Group | null): group is Group => group !== null);
            }
            // Вариант 3: всего один group
            else if (groupsData.group && !Array.isArray(groupsData.group)) {
                const group = extractGroupFromXml(groupsData.group);
                if (group) groups = [group];
            }
        }
        const wrapper = createGroupsWrapper({
            groups: { group: groups },
        });
        return isValidGroupsWrapper(wrapper) ? wrapper : null;
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

export const parseGroupXml = (xml: string): Group | null => {
    try {
        const parsed = parser.parse(xml);
        return extractGroupFromXml(parsed);
    } catch {
        return null;
    }
};

export const parseGroupsWrapperXml = (xml: string): GroupsWrapper | null => {
    try {
        const parsed = parser.parse(xml);
        return extractGroupsWrapperFromXml(parsed);
    } catch {
        return null;
    }
};
