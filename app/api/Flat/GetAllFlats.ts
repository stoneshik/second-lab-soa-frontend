import { api } from "~/utils/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseWrapperListFlatsXml, type WrapperListFlats } from "~/types/flat/WrapperListFlats";
import { createSortBlockString, type SortBlock } from "~/types/SortValue";

export interface ParamsForGetWrapperListFlats {
    filter: string[] | null;
    page: number;
    size: number;
    sort: SortBlock[] | null;
}

export const getWrapperListFlats = async (
    params: ParamsForGetWrapperListFlats
): Promise<WrapperListFlats> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', params.page.toString());
        queryParams.append('size', params.size.toString());
        if (params.filter) {
            params.filter.forEach(filter => {
                queryParams.append('filter', filter);
            });
        }
        if (params.sort) {
            for (const sortItem of params.sort) {
                const sortValueString = createSortBlockString(sortItem);
                if (sortValueString != null) {
                    queryParams.append('sort', sortValueString);
                }
            }
        }
        const response = await api.get("/flats", { params: queryParams });
        const responseWrapperListFlats = parseWrapperListFlatsXml(response.data);
        return responseWrapperListFlats as WrapperListFlats;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
