import { Router } from "express";
import { videosController } from "./videosController";

export const videosRouter = Router();

videosRouter.get('/', videosController.getVideos);
videosRouter.post('/', videosController.createVideos);