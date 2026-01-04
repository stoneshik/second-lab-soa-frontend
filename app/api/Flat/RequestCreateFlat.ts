import { api } from "~/utils/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { serializeFlatRequestCreateToXml, type FlatRequestCreate } from "~/types/flat/FlatRequestCreate";

export const requestCreateFlat = async (flatRequestCreate: FlatRequestCreate): Promise<void> => {
    try {
        const xmlValue: string = serializeFlatRequestCreateToXml(flatRequestCreate);
        await api.post("/flats", xmlValue);
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
