import { ObjectId, WithId } from "mongodb";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { postsCollection } from "../../../db/db";
import { TPost } from "../types/post";
import { TPostDTO } from "../dto/posts-input.dto";

export const postsRepository = {
    getPosts: async (): Promise<WithId<TPost>[]> => {
        return await postsCollection.find().toArray();
    },

    getPostById: async (id: string): Promise<WithId<TPost> | null> => {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }
        
        return await postsCollection.findOne({ _id: new ObjectId(id) });
    },

    createPost: async (post: TPostDTO): Promise<WithId<TPost> | null> => {
        const blog = await blogsRepository.getBlogById(post.blogId);

        if(!blog) {
            return null;
        }

        const newPost: TPost = {
            ...post,
            title: post.title.trim(),
            shortDescription: post.shortDescription.trim(),
            content: post.content.trim(),
            blogId: post.blogId.trim(),
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
        };

        const postWithoutMongoId = await postsCollection.insertOne(newPost);

        return {...newPost, _id: postWithoutMongoId.insertedId};
    },

    updatePostById: async (id: string, post: TPostDTO): Promise<WithId<TPost> | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const updatedBlog = await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...post } },
            { returnDocument: 'after' },
        );

        return updatedBlog;
    },

    deletePostById: async (id: string): Promise<string | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedBlog = await postsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedBlog.deletedCount < 1) {
            return null
        }

        return id;
    }
}