import express from 'express';
import cors from 'cors';
import { videosRouter } from './videos/videos.router'
import { SETTINGS } from './settings';
 
export const app = express();
app.use(express.json());
app.use(cors());
 
// app.get('/', (req, res) => {
//     // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
//     res.status(200).json({version: '1.0'})
// })


// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.VIDEOS, videosRouter);