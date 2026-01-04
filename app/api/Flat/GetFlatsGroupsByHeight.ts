import { api } from "~/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";
import { parseGroupsWrapperXml, type GroupsWrapper } from "~/types/flat/GroupsWrapper";

export const getFlatsGroupsByHeight = async (): Promise<GroupsWrapper> => {
    try {
        const response = await api.get(`/flats/group-by/height`);
        const responseValue = parseGroupsWrapperXml(response.data);
        return responseValue as GroupsWrapper;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
