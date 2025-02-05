import { Request, Response } from "express";
import { db } from "../db";
import { TVideoDB } from "./types";
import { randomUUID } from "crypto";
import { createVideoValidation, getNextDayInISOString } from "./helpers";
import { Resolutions } from "./constants";

export const videosController = {
    getVideos: (req: Request, res: Response) => {
        const videos = db.videos;

        res
            .status(200)
            .json(videos);
    },
    createVideos: (req: Request, res: Response) => {
        const errors = createVideoValidation(req.body);

        if (errors.errorsMessages.length) {
            res.status(400).json(errors);
        }

        const newVideo: TVideoDB = {
            ...req.body,
            id: randomUUID(),
            canBeDownloaded: req.body.canBeDownloaded ?? false,
            minAgeRestriction: req.body.minAgeRestriction ?? null,
            createdAt: req.body.createdAt ?? new Date().toISOString(),
            publicationDate: req.body.publicationDate ?? getNextDayInISOString(req.body.createdAt ?? new Date().toISOString()),
            availableResolutions: req.body.availableResolutions,
        };

        db.videos = [...db.videos, newVideo];

        res
            .status(201)
            .json(newVideo)
    }
}