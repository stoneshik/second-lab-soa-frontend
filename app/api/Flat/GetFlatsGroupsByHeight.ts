import { api } from "~/utils/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseFlatGroupsByHeightWrapperXml, type FlatGroupsByHeightWrapper } from "~/types/flat/FlatGroupsByHeightWrapper";

export const getFlatsGroupsByHeight = async (): Promise<FlatGroupsByHeightWrapper> => {
    try {
        const response = await api.get(`/flats/group-by/height`);
        const responseValue = parseFlatGroupsByHeightWrapperXml(response.data);
        return responseValue as FlatGroupsByHeightWrapper;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
