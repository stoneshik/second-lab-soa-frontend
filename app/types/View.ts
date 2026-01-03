export enum View {
    STREET = "STREET",
    YARD = "YARD",
    BAD = "BAD",
    GOOD = "GOOD",
}

export const ViewDictionary: Record<string, string> = {
    STREET: "street",
    YARD: "yard",
    BAD: "bad",
    GOOD: "good",
};

export const parseView = (value: unknown): View | null => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value !== 'string') {
        return null;
    }
    const upperValue = value.toUpperCase();
    if (Object.values(View).includes(upperValue as View)) {
        return upperValue as View;
    }
    return null;
};
