import { Request, Response } from "express";
import { db } from "../db";
import { TVideoDB } from "./types";
import { createOrUpdateVideoValidation, getNextDayInISOString } from "./helpers";

export const videosController = {
    getVideos: (req: Request, res: Response) => {
        const videos = db.videos;
        res
            .status(200)
            .json(videos);
    },
    getVideoById: (req: Request, res: Response) => {
        const videos = db.videos;
        const id = +req.params.id;
        const findingVideo = videos.find(video => video.id === id);

        if(findingVideo) {
            res
                .status(200)
                .json(findingVideo);
        } else { 
            res
                .status(404)
                .send('Video for passed id doesn\'t exist');
        }
        
    },
    createVideos: (req: Request, res: Response) => {
        const errors = createOrUpdateVideoValidation(req.body);

        if (errors.errorsMessages.length) {
            res
                .status(400)
                .json(errors);
        } else {
            const newVideo: TVideoDB = {
                ...req.body,
                id: Math.round(Date.now() + Math.random()),
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

        
    },
    updateVideoById: (req: Request, res: Response) => {
        const videos = db.videos;
        const id = +req.params.id;
        const videoIndex = videos.findIndex(video => video.id === id);

        if(videoIndex !== -1) {
            const errors = createOrUpdateVideoValidation(req.body);

            if (errors.errorsMessages.length) {
                res
                    .status(400)
                    .json(errors);
            } else {
                videos[videoIndex] = {
                    ...req.body,
                    id,
                };

                res
                    .status(204)
                    .send('Updated!');
            }
        } else { 
            res
                .status(404)
                .send('Video for passed id doesn\'t exist');
        }
    },
    deleteVideoById: (req: Request, res: Response) => {
        const videos = db.videos;
        const id = +req.params.id;
        const videoIndex = videos.findIndex(video => video.id === id);

        if(videoIndex !== -1) {
            videos.splice(videoIndex, 1);

            res
                .status(204)
                .send('Deleted!');
        } else { 
            res
                .status(404)
                .send('Video for passed id doesn\'t exist');
        }
    }
}