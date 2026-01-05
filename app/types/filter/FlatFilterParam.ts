import type { FlatFilterField } from "./FlatFilterField";
import {
    FlatRangeAndIntervalDictionary as FlatRangeAndIntervalOperationDictionary,
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
): string => {
    const flatFilterField = flatFilterParam.flatFilterField;
    const flatFilterOperation = flatFilterParam.flatFilterOperation;
    const firstArgument = flatFilterParam.firstArgument;
    const secondArgument = flatFilterParam.secondArgument;
    if (flatFilterField === null ||
        flatFilterOperation === null ||
        firstArgument === null) {
        return "";
    }
    if (!(flatFilterOperation in FlatRangeAndIntervalOperationDictionary)) {
        return `${flatFilterField}(${flatFilterOperation})${firstArgument}`;
    }
    if (secondArgument === null) {
        return "";
    }
    return `${flatFilterField}(${flatFilterOperation})${firstArgument}_${secondArgument}`;
};
