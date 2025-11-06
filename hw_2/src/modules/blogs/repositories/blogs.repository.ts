import { DeleteResult, ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../../../db/db";
import { TBlog, TBlogQueryInput } from "../types/blog";
import { TBlogDTO } from "../application/dto/blogs-input.dto";

export const blogsRepository = {
    getBlogs: async (queryDto: TBlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> => {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(filter);

        return {
            items,
            totalCount,
        }
    },

    getBlogById: async (id: string): Promise<WithId<TBlog> | null> => {
        return await blogsCollection.findOne({ _id: new ObjectId(id) });
    },

    createBlog: async (blog: TBlog): Promise<ObjectId> => {
        const newBlog = await blogsCollection.insertOne(blog);

        return newBlog.insertedId;
    },

    updateBlogById: async (id: string, blog: TBlogDTO): Promise<WithId<TBlog> | null> => {
        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...blog } },
            { 
                returnDocument: 'after', 
            },
        );

        return updatedBlog;
    },

    deleteBlogById: async (id: string): Promise<DeleteResult> => {
        return await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    }
}