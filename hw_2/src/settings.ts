import {config} from 'dotenv';
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty' || 'admin\qwerty',
    MONGO_URL: process.env.MONGO_URL,
    MONGODB_NAME: process.env.MONGOBD_NAME,
}