import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { MusicBand } from "~/types/flat/Flat";

export interface ParamsForGetMusicBandId { id: number; }

export const getMusicBandById = async ({ id }: ParamsForGetMusicBandId): Promise<MusicBand> => {
    try {
        const response = await api.get(`/music-bands/${id}`);
        return response.data as MusicBand;
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
