import type { SortNameField } from "./SortNameField";
import type { SortOrder } from "./SortOrder";

export interface SortBlock {
    sortNameField: SortNameField | null,
    sortOrder: SortOrder | null
}

export const createSortBlockString = (sortBlock: SortBlock): string | null => {
    const sortNameField = sortBlock.sortNameField;
    const sortOrder = sortBlock.sortOrder;
    if (sortNameField == null || sortOrder == null) {
        return null;
    }
    return sortNameField + "," + sortOrder;
};
