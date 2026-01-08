export enum SortType {
    ASC = "ASC",
    DESC = "DESC",
}

export const SortTypeDictionary: Record<string, string> = {
    [SortType.ASC]: "Ascending order",
    [SortType.DESC]: "Descending order",
};
