import { api } from "~/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForDeleteFlat { id: number; }

export const deleteFlat = async ({ id }: ParamsForDeleteFlat): Promise<void> => {
    try {
        await api.delete(`/flats/${id}`);
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
