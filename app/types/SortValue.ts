import type { SortNameField } from "./SortNameField";
import type { SortOrder } from "./SortOrder";

export interface SortValue {
    sortNameField: SortNameField | null,
    sortOrder: SortOrder | null
}

export const createSortValueString = (sortValue: SortValue): string | null => {
    const sortNameField = sortValue.sortNameField;
    const sortOrder = sortValue.sortOrder;
    if (sortNameField == null || sortOrder == null) {
        return null;
    }
    return sortNameField + "," + sortOrder;
};
