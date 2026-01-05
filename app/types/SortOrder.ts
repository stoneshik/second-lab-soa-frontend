export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export const SortOrderDictionary: Record<string, string> = {
    [SortOrder.ASC]: "Ascending order",
    [SortOrder.DESC]: "Descending order",
};
