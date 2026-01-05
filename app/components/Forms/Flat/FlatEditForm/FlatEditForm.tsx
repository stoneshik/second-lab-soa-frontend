import { useCallback, useEffect, useState } from "react";
import { updateFlat, type ParamsForUpdateFlat } from "~/api/Flat/UpdateFlat";
import { Button } from "~/components/UI/Button/Button";
import { BalconyType, BalconyTypeDictionary } from "~/types/BalconyType";
import { createCoordinatesRequestUpdate } from "~/types/coordinates/CoordinatesRequestUpdate";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Flat } from "~/types/flat/Flat";
import { createFlatRequestUpdate } from "~/types/flat/FlatRequestUpdate";
import { createHouseRequestUpdate } from "~/types/house/HouseRequestUpdate";
import { Transport, TransportDictionary } from "~/types/Transport";
import { View, ViewDictionary } from "~/types/View";
import { convertPriceNumberToString, convertPriceStringToNumber } from "~/utils/priceConvert";
import { validateFlatForm } from "~/utils/validateFlatForm";
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

    const [price, setPrice] = useState<number>(1);
    const [balconyType, setBalconyType] = useState<BalconyType>(BalconyType.WITHOUT_BALCONY);
    const [walkingMinutesToMetro, setWalkingMinutesToMetro] = useState<number>(1);
    const [transportMinutesToMetro, setTransportMinutesToMetro] = useState<number>(1);

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
            setPrice(convertPriceStringToNumber(flat.price) ?? 0.01);
            setBalconyType(flat.balconyType);
            setWalkingMinutesToMetro(flat.walkingMinutesToMetro);
            setTransportMinutesToMetro(flat.transportMinutesToMetro);
            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [flat]);
    const validate = useCallback(() => {
        const errorMessage = validateFlatForm(
            name,
            coordinatesX,
            coordinatesY,
            area,
            numberOfRooms,
            height,
            houseName,
            houseYear,
            houseNumberOfFlatsOnFloor,
            convertPriceNumberToString(price),
            balconyType,
            walkingMinutesToMetro,
            transportMinutesToMetro
        );
        if (errorMessage !== null) {
            setErrorMessage(errorMessage);
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
        price,
        balconyType,
        walkingMinutesToMetro,
        transportMinutesToMetro
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
                    price: convertPriceNumberToString(price),
                    balconyType: balconyType,
                    walkingMinutesToMetro: walkingMinutesToMetro,
                    transportMinutesToMetro: transportMinutesToMetro
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
            price,
            balconyType,
            walkingMinutesToMetro,
            transportMinutesToMetro,
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
                        value={(numberOfRooms !== null && Number.isFinite(numberOfRooms)) ? numberOfRooms : 1}
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
                    <label className={styles.label} htmlFor="house-name">House name</label>
                    <input
                        id="house-name"
                        className={styles.input}
                        type="text"
                        value={houseName}
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
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-price">Price*</label>
                    <input
                        id="flat-price"
                        className={styles.input}
                        type="number"
                        value={(price !== null && (Number.isFinite(price)) ? price : 0.01)}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        disabled={loading}
                        min={0.01}
                        step={0.01}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-balcony-type">Flat balcony type*</label>
                    <select
                        id="flat-balcony-type"
                        value={balconyType as string ?? ""}
                        onChange={(e) => setBalconyType(e.target.value as BalconyType)}>
                        {Object.values(BalconyType).map((s) => (
                            <option key={s} value={s}>
                                { BalconyTypeDictionary[s] }
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-walking-minutes-to-metro">Walking minutes to metro*</label>
                    <div>
                        <input
                            id="flat-walking-minutes-to-metro"
                            className={styles.input}
                            type="number"
                            value={(walkingMinutesToMetro !== null && Number.isFinite(walkingMinutesToMetro)) ? walkingMinutesToMetro : 1}
                            onChange={(e) => setWalkingMinutesToMetro(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="flat-transport-minutes-to-metro">Transport minutes to metro*</label>
                    <div>
                        <input
                            id="flat-transport-minutes-to-metro"
                            className={styles.input}
                            type="number"
                            value={(transportMinutesToMetro !== null && Number.isFinite(transportMinutesToMetro)) ? transportMinutesToMetro : 1}
                            onChange={(e) => setTransportMinutesToMetro(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
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
