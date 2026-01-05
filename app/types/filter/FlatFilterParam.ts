import type { FlatFilterField } from "./FlatFilterField";
import {
    FlatRangeAndIntervalSet,
    type FlatFilterOperation
} from "./FlatFilterOperation";

export interface FlatFilterParam {
    flatFilterField: FlatFilterField | null,
    flatFilterOperation: FlatFilterOperation | null,
    firstArgument: string | null,
    secondArgument: string | null,
}

export const createFilterParamString = (
    flatFilterParam: FlatFilterParam
): string | null => {
    const flatFilterField = flatFilterParam.flatFilterField;
    const flatFilterOperation = flatFilterParam.flatFilterOperation;
    const firstArgument = flatFilterParam.firstArgument;
    const secondArgument = flatFilterParam.secondArgument;
    if (flatFilterField === null ||
        flatFilterOperation === null ||
        firstArgument === null) {
        return null;
    }
    if (!FlatRangeAndIntervalSet.has(flatFilterOperation)) {
        return `${flatFilterField}(${flatFilterOperation})${firstArgument}`;
    }
    if (secondArgument === null) {
        return null;
    }
    return `${flatFilterField}(${flatFilterOperation})${firstArgument}_${secondArgument}`;
};
