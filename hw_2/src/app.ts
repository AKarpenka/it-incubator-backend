import express from 'express';
import cors from 'cors';
import { SETTINGS } from './settings';
import { blogsRouter } from './modules/blogs/blogs-router';
import { postsRouter } from './modules/posts/posts-router';
import { testingRouter } from './modules/testing/testing-router';
 
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
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
