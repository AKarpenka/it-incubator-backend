import { DeleteResult, ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../../../db/db";
import { TBlog, TBlogQueryInput } from "../types/blog";
import { TBlogDTO } from "../application/dto/blogs-input.dto";
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {
    async getBlogs (queryDto: TBlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> {
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

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirectionValue })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogsCollection.countDocuments(filter);

        return {
            items,
            totalCount,
        }
    }

    async getBlogById (id: string): Promise<WithId<TBlog> | null> {
        return await blogsCollection.findOne({ _id: new ObjectId(id) });
    }

    async createBlog (blog: TBlog): Promise<ObjectId> {
        const newBlog = await blogsCollection.insertOne(blog);

        return newBlog.insertedId;
    }

    async updateBlogById (id: string, blog: TBlogDTO): Promise<WithId<TBlog> | null> {
        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...blog } },
            { 
                returnDocument: 'after', 
            },
        );

        return updatedBlog;
    }

    async deleteBlogById (id: string): Promise<DeleteResult> {
        return await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    }
}
