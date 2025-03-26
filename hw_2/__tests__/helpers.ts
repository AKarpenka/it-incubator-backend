import { db } from "../src/db/db";
import { TBlog, TPost } from "../src/types/TDataBase";

export type ReadonlyDBType = {
    blogs: Readonly<TBlog[]>;
    posts: Readonly<TPost[]>;
}

export const setDB = (dataset?: Partial<ReadonlyDBType>) => {
    if (!dataset) {
        db.blogs = [];
        db.posts = [];

        return;
    }

    // если что-то передано - то заменяем старые значения новыми,
    // не ссылки - а глубокое копирование, чтобы не изменять dataset
    db.blogs = dataset.blogs?.map(b => ({...b})) || db.blogs;
    db.posts = dataset.posts?.map(p => ({...p})) || db.posts;
};

export const createString = (length: number) => {
    let s = '';

    for (let x = 1; x <= length; x++) {
        s += x % 10
    }

    return s;
};
