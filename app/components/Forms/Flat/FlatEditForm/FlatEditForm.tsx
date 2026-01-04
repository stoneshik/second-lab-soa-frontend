import { useCallback, useEffect, useState } from "react";
import { updateFlat, type ParamsForUpdateFlat } from "~/api/Flat/UpdateFlat";
import { Button } from "~/components/UI/Button/Button";
import { createCoordinatesRequestUpdate } from "~/types/coordinates/CoordinatesRequestUpdate";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Flat } from "~/types/flat/Flat";
import { createFlatRequestUpdate } from "~/types/flat/FlatRequestUpdate";
import { createHouseRequestUpdate } from "~/types/house/HouseRequestUpdate";
import { Transport, TransportDictionary } from "~/types/Transport";
import { View, ViewDictionary } from "~/types/View";
import styles from "./FlatEditForm.module.scss";

type Props = { flat: Flat; };

export function FlatEditForm({ flat }: Readonly<Props>) {
    const [name, setName] = useState<string>("");

    const [coordinatesX, setCoordinatesX] = useState<number>(0);
    const [coordinatesY, setCoordinatesY] = useState<number>(0);

    const [area, setArea] = useState<number | null>(null);
    const [numberOfRooms, setNumberOfRooms] = useState<number>(1);
    const [height, setHeight] = useState<number>(1);
    const [view, setView] = useState<View | null>(null);
    const [transport, setTransport] = useState<Transport | null>(null);

    const [houseName, setHouseName] = useState<string>("");
    const [houseYear, setHouseYear] = useState<number | null>(null);
    const [houseNumberOfFlatsOnFloor, setHouseNumberOfFlatsOnFloor] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    useEffect(() => {
        if (flat) {
            setName(flat.name);
            const coordinates = flat.coordinates;
            setCoordinatesX(coordinates.x);
            setCoordinatesY(coordinates.y);
            setArea(flat.area);
            setNumberOfRooms(flat.numberOfRooms);
            setHeight(flat.height);
            setView(flat.view);
            setTransport(flat.transport);
            const house = flat.house;
            if (house !== null) {
                setHouseName(house.name);
                setHouseYear(house.year);
                setHouseNumberOfFlatsOnFloor(house.numberOfFlatsOnFloor);
            }
            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [flat]);

    const validate = useCallback(() => {
        if (name === null || name.trim().length === 0) {
            setErrorMessage("Name flat required");
            return false;
        }
        if (coordinatesX === null || coordinatesY == null) {
            setErrorMessage("Coordinates of flat required");
            return false;
        }
        if (coordinatesX <= -993) {
            setErrorMessage("Coordinate x must be greater than -993");
            return false;
        }
        if (!Number.isFinite(coordinatesX)) {
            setErrorMessage("Coordinate x must be finite");
            return false;
        }
        if (!Number.isInteger(coordinatesY)) {
            setErrorMessage("Coordinate y must be integer");
            return false;
        }
        if (area !== null && !Number.isInteger(area)) {
            setErrorMessage("Area must be integer");
            return false;
        }
        if (area !== null && area <= 0) {
            setErrorMessage("Area must be greater than 0");
            return false;
        }
        if (numberOfRooms === null) {
            setErrorMessage("Number of rooms required");
            return false;
        }
        if (!Number.isInteger(numberOfRooms)) {
            setErrorMessage("Number of rooms must be integer");
            return false;
        }
        if (numberOfRooms <= 0) {
            setErrorMessage("Number of rooms must be greater than 0");
            return false;
        }
        if (height === null) {
            setErrorMessage("Height required");
            return false;
        }
        if (!Number.isInteger(height)) {
            setErrorMessage("Height must be integer");
            return false;
        }
        if (height <= 0) {
            setErrorMessage("Height must be greater than 0");
            return false;
        }
        if (houseName === null) {
            setErrorMessage("House name required");
            return false;
        }
        if (houseYear !== null && !Number.isInteger(height)) {
            setErrorMessage("House year must be integer");
            return false;
        }
        if (houseYear !== null && houseYear <= 0) {
            setErrorMessage("House year must be greater than 0");
            return false;
        }
        if (houseNumberOfFlatsOnFloor !== null && !Number.isInteger(houseNumberOfFlatsOnFloor)) {
            setErrorMessage("House number of flats on floor must be integer");
            return false;
        }
        if (houseNumberOfFlatsOnFloor !== null && houseNumberOfFlatsOnFloor <= 0) {
            setErrorMessage("House number of flats on floor must be greater than 0");
            return false;
        }
        return true;
    }, [
        name,
        coordinatesX,
        coordinatesY,
        area,
        numberOfRooms,
        height,
        view,
        transport,
        houseName,
        houseYear,
        houseNumberOfFlatsOnFloor,
    ]);
    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const coordinatesRequestUpdate = createCoordinatesRequestUpdate({
                    x: coordinatesX,
                    y: coordinatesY,
                });
                const house = createHouseRequestUpdate({
                    name: houseName,
                    year: houseYear,
                    numberOfFlatsOnFloor: houseNumberOfFlatsOnFloor,
                });
                const flatRequestUpdate = createFlatRequestUpdate({
                    name: name,
                    coordinates: coordinatesRequestUpdate,
                    area: area,
                    numberOfRooms: numberOfRooms,
                    height: height,
                    view: view,
                    transport: transport,
                    house: house,
                });
                const params: ParamsForUpdateFlat = {
                    id: flat.id,
                    flatRequestUpdate: flatRequestUpdate,
                };
                await updateFlat(params);
                setSuccessMessage("Flat successfully updated");
                setErrorMessage("");
                setTimeout(() => globalThis.location.reload(), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Error during update");
            } finally { setLoading(false); }
        },
        [
            name,
            coordinatesX,
            coordinatesY,
            area,
            numberOfRooms,
            height,
            view,
            transport,
            houseName,
            houseYear,
            houseNumberOfFlatsOnFloor,
            validate,
        ]
    );

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Flat update</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-name">Name*</label>
                    <input
                        id="flat-name"
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        maxLength={50}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-x">x*</label>
                    <input
                        id="coordinates-x"
                        className={styles.input}
                        type="number"
                        value={(coordinatesX !== null && (Number.isFinite(coordinatesX)) ? coordinatesX : 0)}
                        onChange={(e) => setCoordinatesX(Number(e.target.value))}
                        disabled={loading}
                        min={-993}
                        step={0.01}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-y">y*</label>
                    <input
                        id="coordinates-y"
                        className={styles.input}
                        type="number"
                        value={(coordinatesY !== null && Number.isFinite(coordinatesY)) ? coordinatesY : 0}
                        onChange={(e) => setCoordinatesY(Number(e.target.value))}
                        disabled={loading}
                        step={1}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-area">Area</label>
                    <div>
                        <input
                            id="flat-area"
                            className={styles.input}
                            type="number"
                            value={(area !== null && Number.isFinite(area)) ? area : ""}
                            onChange={(e) => setArea(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
                        <button type="button" onClick={() => setArea(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-number-of-rooms">Number of rooms*</label>
                    <input
                        id="flat-number-of-rooms"
                        className={styles.input}
                        type="number"
                        value={(numberOfRooms !== null && Number.isFinite(numberOfRooms)) ? numberOfRooms : ""}
                        onChange={(e) => setNumberOfRooms(Number(e.target.value))}
                        disabled={loading}
                        min={1}
                        step={1}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-height">Height*</label>
                    <input
                        id="flat-height"
                        className={styles.input}
                        type="number"
                        value={(height !== null && Number.isFinite(height)) ? height : 1}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        disabled={loading}
                        min={1}
                        step={1}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-view">Flat view</label>
                    <select
                        id="flat-view"
                        value={view as string ?? ""}
                        onChange={(e) => (e.target.value === "-")? setView(null) : setView(e.target.value as View)}>
                        {["-", ...Object.values(View)].map((s) => (
                            <option key={s} value={s}>
                                { (s === "-")? "-" : ViewDictionary[s] }
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-transport">Transport</label>
                    <select
                        id="flat-transport"
                        value={view as string ?? ""}
                        onChange={(e) => (e.target.value === "-")? setTransport(null) : setTransport(e.target.value as Transport)}>
                        {["-", ...Object.values(Transport)].map((s) => (
                            <option key={s} value={s}>
                                { (s === "-")? "-" : TransportDictionary[s] }
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="house-name">House name*</label>
                    <input
                        id="house-name"
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setHouseName(e.target.value)}
                        disabled={loading}
                        maxLength={50}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="house-year">House year</label>
                    <div>
                        <input
                            id="house-year"
                            className={styles.input}
                            type="number"
                            value={(houseYear !== null && Number.isFinite(houseYear)) ? houseYear : ""}
                            onChange={(e) => setHouseYear(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
                        <button type="button" onClick={() => setHouseYear(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="house-number-of-flats-on-floor">House number of flats on floor</label>
                    <div>
                        <input
                            id="house-number-of-flats-on-floor"
                            className={styles.input}
                            type="number"
                            value={(houseNumberOfFlatsOnFloor !== null && Number.isFinite(houseNumberOfFlatsOnFloor)) ? houseNumberOfFlatsOnFloor : ""}
                            onChange={(e) => setHouseNumberOfFlatsOnFloor(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
                        <button type="button" onClick={() => setHouseNumberOfFlatsOnFloor(null)}>×</button>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Updated..." : "Update"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
}
