import { api } from "~/lib/axios";
import { parseErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForDeleteOneFlatByEstablishmentDate {
    houseName: string,
    houseYear: number,
    numberOfFlatOnFloor: number
}

export const deleteOneFlatByEstablishmentDate = async (
    params: ParamsForDeleteOneFlatByEstablishmentDate
): Promise<void> => {
    try {
        await api.delete("/flats", { params });
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const data = error.response?.data;
            throw parseErrorMessage(data);
        }
        throw new Error(String(error));
    }
};
