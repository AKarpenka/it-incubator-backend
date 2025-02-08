import express from 'express';
import cors from 'cors';
import { videosRouter } from './videos/videos.router'
import { SETTINGS } from './settings';
import { testingRouter } from './testing/testing.router';
 
export const app = express();
app.use(express.json());
app.use(cors());


app.use(SETTINGS.PATH.VIDEOS, videosRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);