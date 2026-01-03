import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import type { Flat } from "~/types/flat/Flat";

import { deleteFlat } from "~/api/Flat/DeleteFlat";
import { getFlatById, type ParamsForGetFlatById } from "~/api/Flat/GetFlatById";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./FlatPage.module.scss";

export default function FlatPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [flat, setFlat] = useState<Flat | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetFlatById) => {
            try {
                const data = await getFlatById(params);
                setFlat(data);
                setErrorMessage("");
            } catch (error) {
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
            }
        }, []
    );

    useEffect(() => {
        let mounted = true;
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            const flatId: number = (id === undefined)? 0 : +id;
            try {
                await load({
                    id: flatId
                });
            } catch {
                setErrorMessage("Failed to load data");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 10_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [id, load]);

    const handlingDelete = async () => {
        const flatId: number = (id === undefined)? 0 : +id;
        try {
            await deleteFlat({id: flatId});
            setSuccessMessage("Flat successfully delete");
            setErrorMessage("");
            setTimeout(() => globalThis.location.assign('/'), 2000);
        } catch (error) {
            if (isErrorMessage(error)) {
                const message = createMessageStringFromErrorMessage(error);
                setErrorMessage(message);
                return;
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>Flat</h1>
            <div className={styles.error}>{errorMessage}</div>
            {!flat && <div className={styles.error}>Flat not found</div>}
            {flat && <FlatTable flats={[flat]} />}
            {flat &&
                <Button className={styles.delete} onClick={handlingDelete} textButton={"❌ Delete flat"} /> }
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
}
