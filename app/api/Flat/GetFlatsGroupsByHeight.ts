import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import { parseGroupsWrapperXml, type GroupsWrapper } from "~/types/flat/GroupsWrapper";

export const getFlatsGroupsByHeight = async (): Promise<GroupsWrapper> => {
    try {
        const response = await api.get(`/flats/group-by/height`);
        const responseValue = parseGroupsWrapperXml(response.data);
        return responseValue as GroupsWrapper;
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
