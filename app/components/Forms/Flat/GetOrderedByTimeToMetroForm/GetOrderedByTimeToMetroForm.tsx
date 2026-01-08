import { useCallback, useEffect, useState } from "react";
import { getOrderedByTimeToMetro, type ParamsGetOrderedByTimeToMetro } from "~/api/Flat/GetOrderedByTimeToMetro";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListFlats } from "~/types/flat/WrapperListFlats";
import { SortType, SortTypeDictionary } from "~/types/params/SortType";
import { TransportType, TransportTypeDictionary } from "~/types/params/TransportType";
import styles from "./GetOrderedByTimeToMetroForm.module.scss";

export function GetOrderedByTimeToMetroForm() {
    const [wrapperListFlats, setWrapperListFlats] = useState<WrapperListFlats | null>(null);
    const [transportType, setTransportType] = useState<TransportType>(TransportType.TRANSPORT);
    const [sortType, setSortType] = useState<SortType>(SortType.ASC);
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const load = useCallback(
        async (params: ParamsGetOrderedByTimeToMetro) => {
            try {
                const responseWrapperListFlats = await getOrderedByTimeToMetro({
                    transportType: params.transportType,
                    sortType: params.sortType,
                    page: params.page,
                    size: params.size
                });
                setWrapperListFlats(responseWrapperListFlats);
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
                    transportType: transportType,
                    sortType: sortType,
                    page: page,
                    size: size
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
        transportType,
        sortType,
        page,
        size,
        load
    ]);
    const flats = wrapperListFlats?.flats;
    const totalPages = wrapperListFlats?.totalPages ?? 1;
    const totalElements = wrapperListFlats?.totalElements ?? 0;

    const handlePrevPage = (): void => {
        setPage((p) => Math.max(0, p - 1));
    };
    const handleNextPage = (): void => {
        setPage((p) => Math.min((totalPages - 1), p + 1));
    };

    return (
        <div className={styles.wrapper}>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Get flats ordered by time to metro</h2>
                <div className={styles.actions}>
                    <select
                        name="transport-type"
                        value={transportType as string}
                        onChange={(e) => {
                            setTransportType(e.target.value as TransportType);
                        }}>
                        {Object.values(TransportType).map((s) => (
                            <option key={s} value={s}>
                                { TransportTypeDictionary[s] }
                            </option>
                        ))}
                    </select>
                    <select
                        name="sort-type"
                        value={sortType as string}
                        onChange={(e) => {
                            setSortType(e.target.value as SortType);
                        }}>
                        {Object.values(SortType).map((s) => (
                            <option key={s} value={s}>
                                { SortTypeDictionary[s] }
                            </option>
                        ))}
                    </select>
                    <select
                        name="size"
                        value={size}
                        onChange={(e) => {
                            setSize(Number(e.target.value));
                            setPage(0);
                        }}>
                        {[5, 10, 20].map((s) => (
                            <option key={s} value={s}>
                                {s} on page
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                </div>
            </form>
        </div>
        <h3>Total found: {totalElements}</h3>
        {flats && <FlatTable flats={flats} />}

        <div className={styles.pagination}>
            <Button onClick={handlePrevPage} textButton={"Back"} disabled={page <= 0}/>
            <span>Page {page + 1} of {totalPages}</span>
            <Button onClick={handleNextPage} textButton={"Forward"} disabled={page >= totalPages - 1}/>
        </div>
        </div>
    );
}
