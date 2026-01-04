import { api } from "~/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseMyResponseXml, type MyResponse } from "~/types/Response";

export const getFlatsSumHeight = async (): Promise<MyResponse> => {
    try {
        const response = await api.get(`/flats/sum/height`);
        const responseValue = parseMyResponseXml(response.data);
        return responseValue as MyResponse;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
