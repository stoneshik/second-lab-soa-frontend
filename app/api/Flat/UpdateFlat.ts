import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
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
            const status = error.response?.status;
            // @ts-ignore
            const data = error.response?.data;
            if (isErrorMessage(data)) { throw data; }
            throw new Error(`Серверная ошибка ${status}: ${JSON.stringify(data)}`);
        }
        throw new Error(String(error));
    }
};
