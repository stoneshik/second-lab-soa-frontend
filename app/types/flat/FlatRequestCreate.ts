import type { CoordinatesRequestCreate } from "../coordinates/CoordinatesRequestCreate";
import type { HouseRequestCreate } from "../house/HouseRequestCreate";
import type { Transport } from "../Transport";
import type { View } from "../View";

export interface FlatRequestCreate {
    name: string;
    coordinates: CoordinatesRequestCreate;
    creationDate: string;
    area: number | null;
    numberOfRooms: number;
    height: number;
    view: View | null;
    transport: Transport | null;
    house: HouseRequestCreate;
}
