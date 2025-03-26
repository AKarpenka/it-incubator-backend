import { db } from "../../db/db";
import { TPost } from "TDataBase";
import { v4 as uuid } from "uuid";
import { blogsRepository } from "../blogs/blogs-repository";

export const postsRepository = {
    getPosts: (): TPost[] => db.posts,
    getPostById: (id: string): TPost | undefined => db.posts.find(post => post.id === id),
    createPost: (body: Record<string, string>): TPost | undefined => {
        const blog = blogsRepository.getBlogById(body.blogId);

        if(!blog) {
            return undefined;
        }

        const newPost: TPost = {
            ...body,
            id: uuid(),
            title: body.title.trim(),
            shortDescription: body.shortDescription.trim(),
            content: body.content.trim(),
            blogId: body.blogId.trim(),
            blogName: blog?.name,
        };

        db.posts = [...db.posts, newPost];

        return newPost;
    },
    updatePostById: (id: string, body: Record<string, string>): TPost | null => {
        const { posts } = db;
        const postIndex = posts.findIndex(post => post.id === id);

        if(postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                ...body,
            };

            return posts[postIndex];
        } else { 
            return null;
        }
    },
    deletePostById: (id: string): string | null => {
        const { posts } = db;
        const postIndex = posts.findIndex(post => post.id === id);

        if(postIndex !== -1) {
            posts.splice(postIndex, 1);

            return id;
        } else { 
            return null;
        }
    }
}