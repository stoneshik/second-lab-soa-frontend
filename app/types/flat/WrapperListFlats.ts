import type { Flat } from "./Flat";

export interface WrapperListFlats {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    flats: Flat[];
}

export const isWrapperListMusicBand = (obj: any): obj is WrapperListFlats => {
    return obj && Array.isArray(obj.flats);
}
