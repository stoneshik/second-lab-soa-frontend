import { type JSX } from "react";

import { FlatCreateForm } from "~/components/Forms/Flat/FlatCreateForm/FlatCreateForm";
import { FlatGroupsByHeightGetForm } from "~/components/Forms/Flat/FlatGroupsByHeightGetForm/FlatGroupsByHeightGetForm";
import { FlatSumHeightsGetForm } from "~/components/Forms/Flat/FlatSumHeightsGetForm/FlatSumHeightsGetForm";
import styles from "./FlatsPage.module.scss";

export default function FlatsPage(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <h1>Operations with flats</h1>
            <FlatCreateForm />
            <FlatSumHeightsGetForm />
            <FlatGroupsByHeightGetForm />
        </div>
    );
}
