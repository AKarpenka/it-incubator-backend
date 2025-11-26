import {config} from 'dotenv';
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BASE_URL: process.env.BASE_URL || 'http://localhost:3003',
        BLOGS: '/api/blogs',
        POSTS: '/api/posts',
        TESTING: '/api/testing',
        USERS: '/api/users',
        AUTH: '/api/auth',
        COMMENTS: '/api/comments',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty' || 'admin\qwerty',
    MONGO_URL: process.env.MONGO_URL,
    MONGODB_NAME: process.env.MONGOBD_NAME,
    SECRET_KEY: process.env.SECRET_KEY || 'error',
    GMAIL_EMAIL_FROM: process.env.GMAIL_EMAIL_FROM || '',
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
}