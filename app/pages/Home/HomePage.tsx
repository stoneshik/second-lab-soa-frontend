import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListFlats, type ParamsForGetWrapperListFlats } from "~/api/Flat/GetAllFlats";
import { FlatTable } from "~/components/Tables/Flat/FlatTable/FlatTable";
import { Button } from "~/components/UI/Button/Button";
import { BalconyType, BalconyTypeDictionary } from "~/types/BalconyType";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import { FlatFilterField, FlatFilterFieldDictionary, FlatFilterFieldFloatSet, FlatFilterFieldIntegerSet, FlatFilterFieldStringSet } from "~/types/filter/FlatFilterField";
import { FlatFilterOperation, FlatFilterOperationDictionary, FlatRangeAndIntervalSet } from "~/types/filter/FlatFilterOperation";
import { createFilterParamString, type FlatFilterParam } from "~/types/filter/FlatFilterParam";
import type { WrapperListFlats } from "~/types/flat/WrapperListFlats";
import { SortNameField, SortNameFieldDictionary } from "~/types/sort/SortNameField";
import { SortOrder, SortOrderDictionary } from "~/types/sort/SortOrder";
import type { SortBlock } from "~/types/sort/SortValue";
import { Transport, TransportDictionary } from "~/types/Transport";
import { View, ViewDictionary } from "~/types/View";
import styles from "./HomePage.module.scss";

export default function HomePage(): JSX.Element {
    const [wrapperListFlats, setWrapperListFlats] = useState<WrapperListFlats | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [filterBlocks, setFilterBlocks] = useState<FlatFilterParam[]>([{
        flatFilterField: null,
        flatFilterOperation: null,
        firstArgument: null,
        secondArgument: null
    }]);
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

    const handlingSearch = async (
        filterParams: FlatFilterParam[],
        page: number,
        size: number,
        sortBlocks: SortBlock[]
    ) => {
        try {
            const sort = sortBlocks.filter(block => block.sortNameField !== null);
            const filter: string[] = [];
            for (const filterParam of filterParams) {
                const filterParamString = createFilterParamString(filterParam);
                if (filterParamString !== null) {
                    filter.push(filterParamString);
                }
            }
            const data = await getWrapperListFlats({
                filter: filter,
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

    const addFilterBlock = () => {
        setFilterBlocks([...filterBlocks, {
            flatFilterField: null,
            flatFilterOperation: null,
            firstArgument: null,
            secondArgument: null
        }]);
    };
    const removeFilterBlock = (index: number) => {
        if (filterBlocks.length <= 1) return;
        const newBlocks = [...filterBlocks];
        newBlocks.splice(index, 1);
        setFilterBlocks(newBlocks);
    };
    const updateFlatFilterField = (index: number, flatFilterField: FlatFilterField | null) => {
        const newBlocks = [...filterBlocks];
        newBlocks[index] = { ...newBlocks[index], flatFilterField };
        setFilterBlocks(newBlocks);
    };
    const updateFlatFilterOperation = (index: number, flatFilterOperation: FlatFilterOperation | null) => {
        const newBlocks = [...filterBlocks];
        newBlocks[index] = { ...newBlocks[index], flatFilterOperation };
        setFilterBlocks(newBlocks);
    };
    const updateFirstArgument = (index: number, firstArgument: string | null) => {
        const newBlocks = [...filterBlocks];
        newBlocks[index] = { ...newBlocks[index], firstArgument };
        setFilterBlocks(newBlocks);
    };
    const updateSecondArgument = (index: number, secondArgument: string | null) => {
        const newBlocks = [...filterBlocks];
        newBlocks[index] = { ...newBlocks[index], secondArgument };
        setFilterBlocks(newBlocks);
    };

    const addSortBlock = () => {
        setSortBlocks([
        ...sortBlocks,
        { sortNameField: null, sortOrder: SortOrder.ASC }
        ]);
    };
    const removeSortBlock = (index: number) => {
        if (sortBlocks.length <= 1) return;
        const newBlocks = [...sortBlocks];
        newBlocks.splice(index, 1);
        setSortBlocks(newBlocks);
    };
    const updateSortNameField = (index: number, sortNameField: SortNameField | null) => {
        const newBlocks = [...sortBlocks];
        newBlocks[index] = { ...newBlocks[index], sortNameField };
        setSortBlocks(newBlocks);
    };
    const updateSortOrder = (index: number, sortOrder: SortOrder) => {
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
                    {filterBlocks.map((block, index) => (
                        <div key={index} className={styles.sortBlock}>
                        <div className={styles.sortBlockContent}>
                            <select
                                name={`filter-name-field-${index}`}
                                value={block.flatFilterField ?? "-"}
                                onChange={(e) => {
                                    updateFlatFilterField(
                                        index,
                                        e.target.value === "-" ? null : (e.target.value as FlatFilterField)
                                    );
                                }}
                                className={styles.select}>
                                <option value="-">-</option>
                                {Object.values(FlatFilterField).map((field) => (
                                    <option key={field} value={field}>
                                    {FlatFilterFieldDictionary[field]}
                                    </option>
                                ))}
                            </select>
                            <select name={`filter-operation-${index}`}
                                value={block.flatFilterOperation ?? "-"}
                                onChange={(e) => {
                                    updateFlatFilterOperation(
                                        index,
                                        e.target.value === "-" ? null : (e.target.value as FlatFilterOperation)
                                    );
                                }}
                                className={styles.select}>
                                <option value="-">-</option>
                                {Object.values(FlatFilterOperation).map((operation) => (
                                    <option key={operation} value={operation}>
                                    {FlatFilterOperationDictionary[operation]}
                                    </option>
                                ))}
                            </select>
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                !FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                block.flatFilterField === FlatFilterField.VIEW && (
                                <select name={`filter-first-argument-${index}`}
                                    value={block.firstArgument ?? "-"}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "-" ? null : (e.target.value as View)
                                        );
                                    }}
                                    className={styles.select}>
                                    <option value="-">-</option>
                                    {Object.values(View).map((firstArgument) => (
                                        <option key={firstArgument} value={firstArgument}>
                                        {ViewDictionary[firstArgument]}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                !FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                block.flatFilterField === FlatFilterField.TRANSPORT && (
                                <select name={`filter-first-argument-${index}`}
                                    value={block.firstArgument ?? "-"}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "-" ? null : (e.target.value as Transport)
                                        );
                                    }}
                                    className={styles.select}>
                                    <option value="-">-</option>
                                    {Object.values(Transport).map((firstArgument) => (
                                        <option key={firstArgument} value={firstArgument}>
                                        {TransportDictionary[firstArgument]}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                !FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                block.flatFilterField === FlatFilterField.BALCONY_TYPE && (
                                <select name={`filter-first-argument-${index}`}
                                    value={block.firstArgument ?? "-"}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "-" ? null : (e.target.value as BalconyType)
                                        );
                                    }}
                                    className={styles.select}>
                                    <option value="-">-</option>
                                    {Object.values(BalconyType).map((firstArgument) => (
                                        <option key={firstArgument} value={firstArgument}>
                                        {BalconyTypeDictionary[firstArgument]}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                !FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                FlatFilterFieldStringSet.has(block.flatFilterField) && (
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={block.firstArgument ?? ""}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "" ? null : e.target.value
                                        );
                                    }}
                                    maxLength={50}/>
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                FlatFilterFieldIntegerSet.has(block.flatFilterField) && (
                                <input
                                    className={styles.input}
                                    type="number"
                                    value={block.firstArgument ?? ""}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "" ? null : e.target.value
                                        );
                                    }}
                                    step={1} />
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                FlatFilterFieldFloatSet.has(block.flatFilterField) && (
                                <input
                                    className={styles.input}
                                    type="number"
                                    value={block.firstArgument ?? ""}
                                    onChange={(e) => {
                                        updateFirstArgument(
                                            index,
                                            e.target.value === "" ? null : e.target.value
                                        );
                                    }}
                                    step={0.1} />
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                FlatFilterFieldIntegerSet.has(block.flatFilterField) && (
                                <input
                                    className={styles.input}
                                    type="number"
                                    value={block.secondArgument ?? ""}
                                    onChange={(e) => {
                                        updateSecondArgument(
                                            index,
                                            e.target.value === "" ? null : e.target.value
                                        );
                                    }}
                                    step={1} />
                            )}
                            {block.flatFilterField !== null &&
                                block.flatFilterOperation !== null &&
                                FlatRangeAndIntervalSet.has(block.flatFilterOperation) &&
                                FlatFilterFieldFloatSet.has(block.flatFilterField) && (
                                <input
                                    className={styles.input}
                                    type="number"
                                    value={block.secondArgument ?? ""}
                                    onChange={(e) => {
                                        updateSecondArgument(
                                            index,
                                            e.target.value === "" ? null : e.target.value
                                        );
                                    }}
                                    step={0.1} />
                            )}
                            {filterBlocks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFilterBlock(index)}
                                    className={styles.removeButton}
                                    aria-label="Remove block">X</button>
                            )}
                        </div>
                        </div>
                    ))}
                    <div className={styles.buttonContainer}>
                        <button type="button"
                            onClick={addFilterBlock}
                            className={styles.addButton}>+ Add filter block</button>
                    </div>
                </div>
                <div>
                    {sortBlocks.map((block, index) => (
                        <div key={index} className={styles.sortBlock}>
                        <div className={styles.sortBlockContent}>
                            <select
                                name={`sort-name-field-${index}`}
                                value={block.sortNameField ?? '-'}
                                onChange={(e) => {
                                    updateSortNameField(
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
                                    updateSortOrder(index, e.target.value as SortOrder);
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
                                    onClick={() => removeSortBlock(index)}
                                    className={styles.removeButton}
                                    aria-label="Remove block">X</button>
                            )}
                        </div>
                        </div>
                    ))}
                    <div className={styles.buttonContainer}>
                        <button type="button"
                            onClick={addSortBlock}
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
                    <button type="button" onClick={() => handlingSearch(filterBlocks, page, size, sortBlocks)}>Search</button>
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
