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
