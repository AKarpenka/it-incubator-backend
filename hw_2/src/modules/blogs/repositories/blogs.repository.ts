import { ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../../../db/db";
import { TBlog } from "../types/blog";
import { TBlogDTO } from "../dto/blogs-input.dto";

export const blogsRepository = {
    getBlogs: async (): Promise<WithId<TBlog>[]> => {
        return await blogsCollection.find().toArray();
    },

    getBlogById: async (id: string): Promise<WithId<TBlog> | null> => {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }
        
        return await blogsCollection.findOne({ _id: new ObjectId(id) });
    },

    createBlog: async (blog: TBlog): Promise<WithId<TBlog>> => {
        const newBlog = await blogsCollection.insertOne(blog);

        return { ...blog, _id: newBlog.insertedId};
    },

    updateBlogById: async (id: string, blog: TBlogDTO): Promise<WithId<TBlog> | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };
        
        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...blog } },
            { 
                returnDocument: 'after', 
            },
        );

        return updatedBlog;
    },

    deleteBlogById: async (id: string): Promise<string | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedBlog = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedBlog.deletedCount < 1) {
            return null;
        };

        return id;
    }
}