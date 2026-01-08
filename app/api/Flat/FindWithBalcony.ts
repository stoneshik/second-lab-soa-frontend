import type { BalconyType } from "~/types/BalconyType";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseFlatXml, type Flat } from "~/types/flat/Flat";
import type { PriceType } from "~/types/params/PriceType";
import { api } from "~/utils/lib/axios";

export interface ParamsFindWithBalcony {
    priceType: PriceType,
    balconyType: BalconyType,
}

export const findWithBalcony = async (
    { priceType, balconyType }: ParamsFindWithBalcony
): Promise<Flat> => {
    try {
        const response = await api.get(`/flats/find-with-balcony/${priceType}/${balconyType}`);
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
