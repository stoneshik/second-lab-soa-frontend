import { type JSX } from "react";

import styles from "./AdditionalOperations.module.scss";
import { FindWithBalconyForm } from "~/components/Forms/Flat/FindWithBalconyForm/FindWithBalconyForm";
import { GetOrderedByTimeToMetroForm } from "~/components/Forms/Flat/GetOrderedByTimeToMetroForm/GetOrderedByTimeToMetroForm";

export default function AdditionalOperationsPage(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <FindWithBalconyForm />
            <GetOrderedByTimeToMetroForm />
        </div>
    );
}
