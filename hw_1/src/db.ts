import { TDataBase } from "./types";
import { Resolutions } from "./videos/constants";

export const db: TDataBase = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2025-02-05T20:15:15.190Z",
            publicationDate: "2025-02-05T20:15:15.190Z",
            availableResolutions: [
                Resolutions.P1440
            ]
        }
    ],
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<TDataBase>) => {
    // если в функцию ничего не передано - то очищаем базу данных
    if (!dataset) {
        Object.keys(db).forEach((key) => db[key as keyof TDataBase] = []);
        
        return;
    }

    // если что-то передано - то заменяем старые значения новыми
    Object.keys(db).forEach((key) => db[key as keyof TDataBase] = dataset.videos || db.videos);
}
