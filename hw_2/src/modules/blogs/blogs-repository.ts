import { getBlogsCollection } from "../../db/db";
import { TBlog } from "TDataBase";
import { v4 as uuid } from "uuid";

export const blogsRepository = {
    getBlogs: async (): Promise<TBlog[]> => {
        const blogsCollection = getBlogsCollection();

        return await blogsCollection.find({}).toArray();
    },
    getBlogById: async (id: string): Promise<TBlog | null> => {
        const blogsCollection = getBlogsCollection();

        return await blogsCollection.findOne({ id });
    },
    createBlog: async (body: Record<string, string>): Promise<TBlog> => {
        const newBlog: TBlog = {
            ...body,
            id: uuid(),
            name: body.name.trim(),
            description: body.description.trim(),
            websiteUrl: body.websiteUrl.trim(),
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const blogsCollection = getBlogsCollection();
        await blogsCollection.insertOne(newBlog);

        return newBlog;
    },
    updateBlogById: async (id: string, body: Record<string, string>): Promise<TBlog | null> => {
        const blogsCollection = getBlogsCollection();

        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { id },
            { $set: { ...body } },
            { returnDocument: 'after' },
        );

        return updatedBlog;
    },
    deleteVideoById: async (id: string): Promise<string | null> => {
        const blogsCollection = getBlogsCollection();

        const deletedBlog = await blogsCollection.deleteOne({ id });

        if (deletedBlog.deletedCount < 1) {
            return null
        }

        return id;
    }
}