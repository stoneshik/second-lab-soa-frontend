import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import { parseWrapperListFlatsXml, type WrapperListFlats } from "~/types/flat/WrapperListFlats";
import { createSortValueString, type SortValue } from "~/types/SortValue";

export interface ParamsForGetWrapperListFlats {
    filter: string[] | null;
    page: number;
    size: number;
    sort: SortValue[] | null;
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
                const sortValueString = createSortValueString(sortItem);
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
            const status = error.response?.status;
            // @ts-ignore
            const data = error.response?.data;
            if (isErrorMessage(data)) { throw data; }
            throw new Error(`Серверная ошибка ${status}: ${JSON.stringify(data)}`);
        }
        throw new Error(String(error));
    }
};
