import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseWrapperListFlatsXml, type WrapperListFlats } from "~/types/flat/WrapperListFlats";
import type { SortType } from "~/types/params/SortType";
import type { TransportType } from "~/types/params/TransportType";
import { api } from "~/utils/lib/axios";

export interface ParamsGetOrderedByTimeToMetro {
    transportType: TransportType,
    sortType: SortType,
    page: number;
    size: number;
}

export const getOrderedByTimeToMetro = async ({
    transportType,
    sortType,
    page,
    size
}: ParamsGetOrderedByTimeToMetro): Promise<WrapperListFlats> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        const response = await api.get(
            `/flats/get-ordered-by-time-to-metro/${transportType}/${sortType}`,
            { params: queryParams }
        );
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
