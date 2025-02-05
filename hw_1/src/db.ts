import { Resolutions } from "./videos/constants"
import { TDataBase } from "./videos/types"


export const db: TDataBase = {
    videos: [
        {
            id: '0',
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
// export const setDB = (dataset?: Partial<DBType>) => {
//     if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
//         db.videos = []
//         // db.some = []
//         return
//     }

//     // если что-то передано - то заменяем старые значения новыми
//     db.videos = dataset.videos || db.videos
//     // db.some = dataset.some || db.some
// }