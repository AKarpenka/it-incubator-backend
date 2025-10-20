import { getPostsCollection } from "../../db/db";
import { TPost } from "TDataBase";
import { v4 as uuid } from "uuid";
import { blogsRepository } from "../blogs/blogs-repository";
import { WithId } from "mongodb";

export const postsRepository = {
    getPosts: async (): Promise<TPost[]> => {
        const postsCollection = getPostsCollection();

        return await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
    },
    getPostById: async (id: string): Promise<TPost | null> => {
        const postsCollection = getPostsCollection();

        return await postsCollection.findOne({ id }, { projection: { _id: 0 } });
    },
    createPost: async (body: Record<string, string>): Promise<TPost | null> => {
        const blog = await blogsRepository.getBlogById(body.blogId);

        if(!blog) {
            return null;
        }

        const newPost: TPost = {
            ...body,
            id: uuid(),
            title: body.title.trim(),
            shortDescription: body.shortDescription.trim(),
            content: body.content.trim(),
            blogId: body.blogId.trim(),
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
        };

        const postsCollection = getPostsCollection();
        await postsCollection.insertOne(newPost);

        const { _id, ...postWithoutMongoId } = newPost as WithId<TPost>;
        
        return postWithoutMongoId;
    },
    updatePostById: async (id: string, body: Record<string, string>): Promise<TPost | null> => {
        const postsCollection = getPostsCollection();

        const updatedBlog = await postsCollection.findOneAndUpdate(
            { id },
            { $set: { ...body } },
            { returnDocument: 'after', projection: { _id: 0 } },
        );

        return updatedBlog;
    },
    deletePostById: async (id: string): Promise<string | null> => {
        const postsCollection = getPostsCollection();

        const deletedBlog = await postsCollection.deleteOne({ id });

        if (deletedBlog.deletedCount < 1) {
            return null
        }

        return id;
    }
}