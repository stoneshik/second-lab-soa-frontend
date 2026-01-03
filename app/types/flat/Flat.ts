import type { Coordinates } from "../coordinates/Coordinates";
import type { House } from "../house/House";
import type { Transport } from "../Transport";
import type { View } from "../View";

export interface Flat {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: House;
}
