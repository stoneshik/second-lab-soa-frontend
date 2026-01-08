export enum PriceType {
    CHEAPEST = "CHEAPEST",
    EXPENSIVE = "EXPENSIVE",
}

export const PriceTypeDictionary: Record<string, string> = {
    [PriceType.CHEAPEST]: "cheapest",
    [PriceType.EXPENSIVE]: "most expensive",
};
