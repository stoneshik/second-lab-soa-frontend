import { useCallback, useState } from "react";
import { getFlatsSumHeight } from "~/api/Flat/GetFlatsSumHeight";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./FlatSumHeightsGetForm.module.scss";

export function FlatSumHeightsGetForm() {
    const [flatSumHeights, setFlatSumHeights] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setLoading(true);
            try {
                const responseValue = await getFlatsSumHeight();
                setFlatSumHeights(responseValue.value);
                setErrorMessage("");
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Error during getting sum heights of flats");
            } finally { setLoading(false); }
        },
        []
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Getting sum heights of flats</h2>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Getting..." : "Get"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {flatSumHeights && <div className={styles.success}>Sum heights of flats: {flatSumHeights}</div>}
                </div>
            </form>
        </div>
    );
}

