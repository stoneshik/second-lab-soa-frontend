export enum FlatFilterOperation {
    EQUALS = "eq",
    NOT_EQUALS = "ne",
    GREATER_THAN = "gt",
    LESS_THAN = "lt",
    GREATER_THAN_OR_EQUALS = "gte",
    LESS_THAN_OR_EQUALS = "lte",
    INTERVAL = "interval",
    RANGE = "range",
}

export const FlatFilterOperationDictionary: Record<string, string> = {
    [FlatFilterOperation.EQUALS]: "equals",
    [FlatFilterOperation.NOT_EQUALS]: "not equals",
    [FlatFilterOperation.GREATER_THAN]: "greater than",
    [FlatFilterOperation.LESS_THAN]: "less than",
    [FlatFilterOperation.GREATER_THAN_OR_EQUALS]: "greater than equals",
    [FlatFilterOperation.LESS_THAN_OR_EQUALS]: "less than equals",
    [FlatFilterOperation.INTERVAL]: "interval",
    [FlatFilterOperation.RANGE]: "range",
};

export const FlatRangeAndIntervalSet = new Set<string>([
    FlatFilterOperation.INTERVAL,
    FlatFilterOperation.RANGE,
]);
