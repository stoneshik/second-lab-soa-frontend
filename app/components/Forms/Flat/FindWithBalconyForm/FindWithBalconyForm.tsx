import { useCallback, useEffect, useState } from "react";
import { findWithBalcony, type ParamsFindWithBalcony } from "~/api/Flat/FindWithBalcony";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { BalconyType, BalconyTypeDictionary } from "~/types/BalconyType";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Flat } from "~/types/flat/Flat";
import { PriceType, PriceTypeDictionary } from "~/types/params/PriceType";
import styles from "./FindWithBalconyForm.module.scss";

export function FindWithBalconyForm() {
    const [flat, setFlat] = useState<Flat | null>(null);
    const [priceType, setPriceType] = useState<PriceType>(PriceType.CHEAPEST);
    const [balconyType, setBalconyType] = useState<BalconyType>(BalconyType.WITHOUT_BALCONY);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const load = useCallback(
        async (params: ParamsFindWithBalcony) => {
            try {
                const responseFlat = await findWithBalcony({
                    priceType: params.priceType,
                    balconyType: params.balconyType
                });
                setFlat(responseFlat);
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
        const fetchData = async () => {
            if (!mounted) return;
            try {
                setLoading(true);
                await load({
                    priceType: priceType,
                    balconyType: balconyType
                });
                setLoading(false);
            } catch {
                setErrorMessage("Failed to load data");
            }
        };
        fetchData();
        return () => {
            mounted = false;
        };
    }, [
        priceType,
        balconyType,
        load
    ]);
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Finding flat by price type and balcony type</h2>
                <div className={styles.actions}>
                    <select
                        name="price-type"
                        value={priceType as string}
                        onChange={(e) => {
                            setPriceType(e.target.value as PriceType);
                        }}>
                        {Object.values(PriceType).map((s) => (
                            <option key={s} value={s}>
                                { PriceTypeDictionary[s] }
                            </option>
                        ))}
                    </select>
                    <select
                        name="balcony-type"
                        value={balconyType as string}
                        onChange={(e) => {
                            setBalconyType(e.target.value as BalconyType);
                        }}>
                        {Object.values(BalconyType).map((s) => (
                            <option key={s} value={s}>
                                { BalconyTypeDictionary[s] }
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                </div>
            </form>
            {flat && <FlatTable flats={[flat]} />}
        </div>
    );
}
