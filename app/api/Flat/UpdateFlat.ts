import { api } from "~/utils/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { serializeFlatRequestUpdateToXml, type FlatRequestUpdate } from "~/types/flat/FlatRequestUpdate";

export interface ParamsForUpdateFlat {
    id: number;
    flatRequestUpdate: FlatRequestUpdate
}

export const updateFlat = async (params: ParamsForUpdateFlat): Promise<void> => {
    try {
        const xmlValue: string = serializeFlatRequestUpdateToXml(params.flatRequestUpdate);
        await api.put(`/flats/${params.id}`, xmlValue);
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
