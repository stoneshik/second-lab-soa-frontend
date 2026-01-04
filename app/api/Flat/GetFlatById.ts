import { api } from "~/utils/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
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
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
