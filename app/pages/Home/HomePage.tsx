import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListFlats, type ParamsForGetWrapperListFlats } from "~/api/Flat/GetAllFlats";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListFlats } from "~/types/flat/WrapperListFlats";
import styles from "./HomePage.module.scss";

export default function HomePage(): JSX.Element {
    const [wrapperListFlats, setWrapperListFlats] = useState<WrapperListFlats | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);

    const load = useCallback(
        async (params: ParamsForGetWrapperListFlats) => {
            try {
                const data = await getWrapperListFlats(params);
                setWrapperListFlats(data);
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
            try {
                await load({
                    page: page,
                    size: size,
                    filter: null,
                    sort: null
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
    }, [
        page,
        size,
        load,
    ]);

    const flats = wrapperListFlats?.flats;
    const totalPages = wrapperListFlats?.totalPages ?? 1;
    const totalElements = wrapperListFlats?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <div className={styles.wrapper}>
            <h1>Flats</h1>
            <h2>Total found: {totalElements}</h2>
            <div className={styles.error}>{errorMessage}</div>
            <div className={styles.controls}>
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

            {flats && <FlatTable flats={flats} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Back"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Forward"} disabled={page >= totalPages - 1}/>
            </div>
        </div>
    );
}
