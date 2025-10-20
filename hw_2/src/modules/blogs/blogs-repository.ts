import { getBlogsCollection } from "../../db/db";
import { TBlog } from "TDataBase";
import { v4 as uuid } from "uuid";
import { WithId } from "mongodb";

export const blogsRepository = {
    getBlogs: async (): Promise<TBlog[]> => {
        const blogsCollection = getBlogsCollection();

        return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
    },
    getBlogById: async (id: string): Promise<TBlog | null> => {
        const blogsCollection = getBlogsCollection();

        return await blogsCollection.findOne({ id }, { projection: { _id: 0 } });
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

        const { _id, ...blogWithoutMongoId } = newBlog as WithId<TBlog>;

        return blogWithoutMongoId;
    },
    updateBlogById: async (id: string, body: Record<string, string>): Promise<TBlog | null> => {
        const blogsCollection = getBlogsCollection();

        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { id },
            { $set: { ...body } },
            { returnDocument: 'after', projection: { _id: 0 } },
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