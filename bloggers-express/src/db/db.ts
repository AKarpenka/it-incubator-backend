import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from '../core/settings/settings';
import { TBlog } from "../modules/blogs/types/blog";
import { TPost } from "../modules/posts/types/post";
import { TUser } from "../modules/users/types/user";
import { TComment } from "../modules/comments/types/comment";
import { TDevice } from "../modules/devices/types/device";
import { TRateLimit } from "../middlewares/rateLimit/types";

const MONGO_URL = SETTINGS.MONGO_URL;
const MONGODB_NAME = SETTINGS.MONGODB_NAME;
const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const DEVICES_COLLECTION_NAME = 'devices';
const RATE_LIMIT_COLLECTION_NAME = 'rate_limit';

export let client: MongoClient;
export let blogsCollection: Collection<TBlog>;
export let postsCollection: Collection<TPost>;
export let usersCollection: Collection<TUser>;
export let commentsCollection: Collection<TComment>;
export let devicesCollection: Collection<TDevice>;
export let rateLimitCollection: Collection<TRateLimit>;

export const runDB = async () => {
    if(!MONGO_URL) {
        console.error('MONGO_URL doesnt found');

        throw new Error('MONGO_URL doesnt found');
    }

    client = new MongoClient(MONGO_URL);

    const db: Db = client.db(MONGODB_NAME);

    blogsCollection = db.collection<TBlog>(BLOGS_COLLECTION_NAME);
    postsCollection = db.collection<TPost>(POSTS_COLLECTION_NAME);
    usersCollection = db.collection<TUser>(USERS_COLLECTION_NAME);
    commentsCollection = db.collection<TComment>(COMMENTS_COLLECTION_NAME);
    devicesCollection = db.collection<TDevice>(DEVICES_COLLECTION_NAME);
    rateLimitCollection = db.collection<TRateLimit>(RATE_LIMIT_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ ping: 1 });

        console.log('✅ Connected to the database');
    } catch (error) {
        await client.close();

        throw new Error(`❌ Database not connected: ${error}`);
    }
}
