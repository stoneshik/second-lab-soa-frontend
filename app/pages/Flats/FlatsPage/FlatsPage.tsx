import { type JSX } from "react";

import { FlatCreateForm } from "~/components/Forms/Flat/FlatCreateForm/FlatCreateForm";
import styles from "./FlatsPage.module.scss";

export default function FlatsPage(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <h1>Operations with flats</h1>
            <FlatCreateForm />
        </div>
    );
}
