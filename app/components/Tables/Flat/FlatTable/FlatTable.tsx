import type { JSX } from "react";
import { Link } from "react-router-dom";
import { BalconyTypeDictionary } from "~/types/BalconyType";
import type { Flat } from "~/types/flat/Flat";
import { TransportDictionary } from "~/types/Transport";
import { ViewDictionary } from "~/types/View";
import styles from "./FlatTable.module.scss";

interface FlatTableProps {
    flats: Flat[];
}

export const FlatTable = ({ flats } : FlatTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>coordinates.id</th>
                    <th>coordinates.x</th>
                    <th>coordinates.y</th>
                    <th>creation date</th>
                    <th>area</th>
                    <th>number of rooms</th>
                    <th>height</th>
                    <th>view</th>
                    <th>transport</th>
                    <th>house.id</th>
                    <th>house.name</th>
                    <th>house.year</th>
                    <th>house.number of flats on floor</th>
                    <th>price</th>
                    <th>balconyType</th>
                    <th>walking minutes to metro</th>
                    <th>transport minutes to metro</th>
                </tr>
            </thead>
            <tbody>
            {flats.map(
                (flat) => (
                    <tr key={flat.id}>
                        <td>
                            <Link to={`/flats/${flat.id}`}>
                                {flat.id}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/flats/${flat.id}`}>
                                {flat.name}
                            </Link>
                        </td>
                        <td>{flat.coordinates.id}</td>
                        <td>{flat.coordinates.x}</td>
                        <td>{flat.coordinates.y}</td>
                        <td>{flat.creationDate}</td>
                        <td>{flat.area ?? "-"}</td>
                        <td>{flat.numberOfRooms}</td>
                        <td>{flat.height}</td>
                        <td>{(flat.view === null)? "-" : ViewDictionary[flat.view]}</td>
                        <td>{(flat.transport === null)? "-" : TransportDictionary[flat.transport]}</td>
                        <td>{flat.house.id}</td>
                        <td>{flat.house.name}</td>
                        <td>{flat.house.year ?? "-"}</td>
                        <td>{flat.house.numberOfFlatsOnFloor ?? "-"}</td>
                        <td>{flat.price}</td>
                        <td>{BalconyTypeDictionary[flat.balconyType]}</td>
                        <td>{flat.walkingMinutesToMetro}</td>
                        <td>{flat.transportMinutesToMetro}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
