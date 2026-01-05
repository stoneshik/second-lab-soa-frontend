import { useCallback, useState } from "react";
import { getFlatsGroupsByHeight } from "~/api/Flat/GetFlatsGroupsByHeight";
import { FlatGroupByHeightTable } from "~/components/Tables/Flat/FlatGroupByHeightTable/FlatGroupByHeightTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { FlatGroupByHeight } from "~/types/flat/FlatGroupsByHeightWrapper";
import styles from "./FlatGroupsByHeightGetForm.module.scss";

export function FlatGroupsByHeightGetForm() {
    const [flatGroupsByHeight, setFlatGroupsByHeight] = useState<FlatGroupByHeight[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setLoading(true);
            try {
                const responseValue = await getFlatsGroupsByHeight();
                setFlatGroupsByHeight(responseValue.groups.group);
                setErrorMessage("");
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Error during getting groups of flats by height");
            } finally { setLoading(false); }
        },
        []
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Getting groups of flats by height</h2>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Getting..." : "Get"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {flatGroupsByHeight && <h3>Total groups: {flatGroupsByHeight.length}</h3>}
                    {flatGroupsByHeight && <FlatGroupByHeightTable groups={flatGroupsByHeight} />}
                </div>
            </form>
        </div>
    );
}

