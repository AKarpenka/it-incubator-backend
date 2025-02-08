import { Router } from "express";
import { videosController } from "./videosController";

export const videosRouter = Router();

//получение всех видео
videosRouter.get('/', videosController.getVideos);

//получение видео по id
videosRouter.get('/:id', videosController.getVideoById);

//добавление одного видео
videosRouter.post('/', videosController.createVideos);

//обновление одного видео
videosRouter.put('/:id', videosController.updateVideoById);

//удаление одного видео
videosRouter.delete('/:id', videosController.deleteVideoById);
