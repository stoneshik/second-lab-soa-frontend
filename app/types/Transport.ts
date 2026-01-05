export enum Transport {
    FEW = "FEW",
    NONE = "NONE",
    LITTLE = "LITTLE",
    NORMAL = "NORMAL",
    ENOUGH = "ENOUGH",
}

export const TransportDictionary: Record<string, string> = {
    [Transport.FEW]: "few",
    [Transport.NONE]: "none",
    [Transport.LITTLE]: "little",
    [Transport.NORMAL]: "normal",
    [Transport.ENOUGH]: "enough",
};

export const parseTransport = (value: unknown): Transport | null => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value !== 'string') {
        return null;
    }
    const upperValue = value.toUpperCase();
    if (Object.values(Transport).includes(upperValue as Transport)) {
        return upperValue as Transport;
    }
    return null;
};
