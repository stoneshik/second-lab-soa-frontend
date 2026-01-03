import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import { serializeFlatRequestCreateToXml, type FlatRequestCreate } from "~/types/flat/FlatRequestCreate";

export const createFlat = async (flatRequestCreate: FlatRequestCreate): Promise<void> => {
    try {
        const xmlValue: string = serializeFlatRequestCreateToXml(flatRequestCreate);
        await api.post("/flats", xmlValue);
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
