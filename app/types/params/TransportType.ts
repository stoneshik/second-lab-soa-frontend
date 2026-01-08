export enum TransportType {
    TRANSPORT = "TRANSPORT",
    WALKING = "WALKING",
}

export const TransportTypeDictionary: Record<string, string> = {
    [TransportType.TRANSPORT]: "transport",
    [TransportType.WALKING]: "walking",
};
