import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import type { MusicBand } from "~/types/flat/Flat";

import { deleteMusicBand } from "~/api/Flat/DeleteFlat";
import { getMusicBandById, type ParamsForGetFlatById } from "~/api/Flat/GetFlatById";
import { MusicBandEditForm } from "~/components/Forms/MusicBands/MusicBandEditForm/MusicBandEditForm";
import { MusicBandTable } from "~/components/Tables/Flat/MusicBandTable/MusicBandTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./MusicBandPage.module.scss";

export default function MusicBandPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [musicBand, setMusicBand] = useState<MusicBand | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetFlatById) => {
            try {
                const data = await getMusicBandById(params);
                setMusicBand(data);
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
            const musicBandId: number = (id === undefined)? 0 : +id;
            try {
                await load({
                    id: musicBandId
                });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
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
        const musicBandId: number = (id === undefined)? 0 : +id;
        try {
            await deleteMusicBand({id: musicBandId});
            setSuccessMessage("Музыкальная группа успешно удалена");
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
            <h1>Музыкальная группа</h1>
            <div className={styles.error}>{errorMessage}</div>
            {!musicBand && <div className={styles.error}>Музыкальная группа не найдена</div>}
            {musicBand && <MusicBandTable musicBands={[musicBand]} />}
            {musicBand && <MusicBandEditForm musicBand={musicBand} />}
            {musicBand &&
                <Button className={styles.delete} onClick={handlingDelete} textButton={"❌ Удаление музыкальной группы"} /> }
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
}
