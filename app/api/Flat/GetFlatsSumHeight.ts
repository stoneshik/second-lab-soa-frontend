import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import { parseMyResponseXml, type MyResponse } from "~/types/Response";

export const getFlatsSumHeight = async (): Promise<MyResponse> => {
    try {
        const response = await api.get(`/flats/sum/height`);
        const responseValue = parseMyResponseXml(response.data);
        return responseValue as MyResponse;
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
