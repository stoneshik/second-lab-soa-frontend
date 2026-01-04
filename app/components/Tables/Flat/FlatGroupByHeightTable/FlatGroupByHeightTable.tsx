import type { JSX } from "react";
import type { FlatGroupByHeight } from "~/types/flat/FlatGroupsByHeightWrapper";
import styles from "./FlatGroupByHeightTable.module.scss";

interface FlatGroupByHeightTableProps {
    groups: FlatGroupByHeight[];
}

export const FlatGroupByHeightTable = ({ groups } : FlatGroupByHeightTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>height flats</th>
                    <th>number flats</th>
                </tr>
            </thead>
            <tbody>
            {groups.map(
                (group) => (
                    <tr key={group.height}>
                        <td>{group.height}</td>
                        <td>{group.count}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
