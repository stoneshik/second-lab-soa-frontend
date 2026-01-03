import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import { parseFlatXml, type Flat } from "~/types/flat/Flat";

export interface ParamsForGetFlatById { id: number; }

export const getFlatById = async ({ id }: ParamsForGetFlatById): Promise<Flat> => {
    try {
        const response = await api.get(`/flats/${id}`);
        const responseFlat = parseFlatXml(response.data);
        return responseFlat as Flat;
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
