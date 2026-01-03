export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export interface SortOrderDictionary {
    [key: string]: string;
}

export const SortOrderDictionary: SortOrderDictionary = {
    asc: "Ascending order",
    desc: "Descending order",
};
