export const convertPriceNumberToString = (value: number): string => {
    if (isNaN(value)) return "0.00";
    return value.toFixed(2);
};

export const convertPriceStringToNumber = (value: string): number | null => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
        return null;
    }
    return parsedValue;
};

export const isValidPrice = (value: string): boolean => {
    const priceRegex = /^\d+(\.\d{2})?$/;
    return priceRegex.test(value.trim());
};
