import type { CoordinatesRequestUpdate } from "../coordinates/CoordinatesRequestUpdate";
import type { HouseRequestUpdate } from "../house/HouseRequestUpdate";
import type { Transport } from "../Transport";
import type { View } from "../View";

export interface MusicBandRequestUpdate {
    name: string;
    coordinates: CoordinatesRequestUpdate;
    creationDate: string;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: HouseRequestUpdate;
}
