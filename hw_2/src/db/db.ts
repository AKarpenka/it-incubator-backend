import { Collection, MongoClient } from "mongodb";
import { TBlog, TPost } from "../types/TDataBase";
import { SETTINGS } from '../settings';

const MONGO_URL = SETTINGS.MONGO_URL;
const MONGODB_NAME = SETTINGS.MONGODB_NAME;

if(!MONGO_URL) {
    console.error('MONGO_URL doesnt found');

    throw new Error('MONGO_URL doesnt found');
}

if(!MONGODB_NAME) {
    console.error('MONGODB_NAME doesnt found');

    throw new Error('MONGODB_NAME doesnt found');
}

const client = new MongoClient(MONGO_URL);

let blogsCollection: Collection<TBlog>;
let postsCollection: Collection<TPost>;

export const runDB = async () => {
    try {
        await client.connect();
        const database = client.db(MONGODB_NAME);
        
        blogsCollection = database.collection<TBlog>('blogs');
        postsCollection = database.collection<TPost>('posts');
        
        await database.command({ ping: 1 });

        console.log('Connected successfully to mongo server');
    } catch (error) {
        console.error('Connection error:', error);

        await client.close();
    }
}


// Геттеры для коллекций (с проверкой инициализации)
export const getBlogsCollection = (): Collection<TBlog> => {
    if (!blogsCollection) throw new Error('Blogs collection not initialized. Call connectToDB() first.');
    return blogsCollection;
};

export const getPostsCollection = (): Collection<TPost> => {
    if (!postsCollection) throw new Error('Posts collection not initialized. Call connectToDB() first.');
    return postsCollection;
};