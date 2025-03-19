import express from 'express';
import cors from 'cors';
import { SETTINGS } from './settings';
import { blogsRouter } from './modules/blogs/blogs-router';
 
export const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/', (req, res) => {
    // the version of backend
    res.status(200).json({
        version: '1.0',
        appName: 'blogs',
    })
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
