export enum BalconyType {
    WITH_BALCONY = "WITH_BALCONY",
    WITHOUT_BALCONY = "WITHOUT_BALCONY",
}

export const BalconyTypeDictionary: Record<string, string> = {
    WITH_BALCONY: "with balcony",
    WITHOUT_BALCONY: "without balcony",
};

export const parseBalconyType = (value: unknown): BalconyType | null => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value !== 'string') {
        return null;
    }
    const upperValue = value.toUpperCase();
    if (Object.values(BalconyType).includes(upperValue as BalconyType)) {
        return upperValue as BalconyType;
    }
    return null;
};
