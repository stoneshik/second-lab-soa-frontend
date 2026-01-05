import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListFlats, type ParamsForGetWrapperListFlats } from "~/api/Flat/GetAllFlats";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListFlats } from "~/types/flat/WrapperListFlats";
import { SortNameField, SortNameFieldDictionary } from "~/types/SortNameField";
import { SortOrder, SortOrderDictionary } from "~/types/SortOrder";
import type { SortBlock } from "~/types/SortValue";
import styles from "./HomePage.module.scss";

export default function HomePage(): JSX.Element {
    const [wrapperListFlats, setWrapperListFlats] = useState<WrapperListFlats | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [sortBlocks, setSortBlocks] = useState<SortBlock[]>([
        { sortNameField: null, sortOrder: SortOrder.ASC }
    ]);

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
        return () => {
            mounted = false;
        };
    }, [
        page,
        size,
        load,
    ]);

    const handlingSearch = async (page: number, size: number, sortBlocks: SortBlock[]) => {
        try {
            const sort = sortBlocks.filter(block => block.sortNameField !== null);
            const data = await getWrapperListFlats({
                filter: null,
                page: page,
                size: size,
                sort: sort
            });
            setWrapperListFlats(data);
            setErrorMessage("");
        } catch (error) {
            if (isErrorMessage(error)) {
                const message = createMessageStringFromErrorMessage(error);
                setErrorMessage(message);
                return;
            }
        }
    };
    const addBlock = () => {
        setSortBlocks([
        ...sortBlocks,
        { sortNameField: null, sortOrder: SortOrder.ASC }
        ]);
    };
    const removeBlock = (index: number) => {
        if (sortBlocks.length <= 1) return;
        const newBlocks = [...sortBlocks];
        newBlocks.splice(index, 1);
        setSortBlocks(newBlocks);
    };
    const updateField = (index: number, sortNameField: SortNameField | null) => {
        const newBlocks = [...sortBlocks];
        newBlocks[index] = { ...newBlocks[index], sortNameField };
        setSortBlocks(newBlocks);
    };
    const updateOrder = (index: number, sortOrder: SortOrder) => {
        const newBlocks = [...sortBlocks];
        newBlocks[index] = { ...newBlocks[index], sortOrder };
        setSortBlocks(newBlocks);
    };

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
                <div>
                    {sortBlocks.map((block, index) => (
                        <div key={index} className={styles.sortBlock}>
                        <div className={styles.sortBlockContent}>
                            <select
                                name={`sort-name-field-${index}`}
                                value={block.sortNameField ?? '-'}
                                onChange={(e) => {
                                    updateField(
                                    index,
                                    e.target.value === '-' ? null : (e.target.value as SortNameField)
                                    );
                                }}
                                className={styles.select}>
                                <option value="-">-</option>
                                {Object.values(SortNameField).map((field) => (
                                    <option key={field} value={field}>
                                    {SortNameFieldDictionary[field]}
                                    </option>
                                ))}
                            </select>
                            <select name={`sort-order-${index}`}
                                value={block.sortOrder ?? "-"}
                                onChange={(e) => {
                                    updateOrder(index, e.target.value as SortOrder);
                                }}
                                className={styles.select}>
                                {Object.values(SortOrder).map((order) => (
                                    <option key={order} value={order}>
                                    {SortOrderDictionary[order]}
                                    </option>
                                ))}
                            </select>
                            {sortBlocks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBlock(index)}
                                    className={styles.removeButton}
                                    aria-label="Remove block">X</button>
                            )}
                        </div>
                        </div>
                    ))}
                    <div className={styles.buttonContainer}>
                        <button type="button"
                            onClick={addBlock}
                            className={styles.addButton}>+ Add sorting block</button>
                    </div>
                </div>
                <div>
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
                    <button type="button" onClick={() => handlingSearch(page, size, sortBlocks)}>Search</button>
                </div>
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
