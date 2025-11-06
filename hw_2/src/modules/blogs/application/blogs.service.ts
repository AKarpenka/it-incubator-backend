import { ObjectId, WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogs.repository";
import { TBlog, TBlogQueryInput } from "../types/blog";
import { TBlogDTO } from "./dto/blogs-input.dto";

export const blogsService = {
    async getBlogs(queryDto: TBlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> {
        return await blogsRepository.getBlogs(queryDto);
    },

    async getBlogById(id: string): Promise<WithId<TBlog> | null> {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        return await blogsRepository.getBlogById(id);
    },

    async createBlog(blog: TBlog): Promise<WithId<TBlog>> {
        const insertedId = await blogsRepository.createBlog(blog);

        return {
            ...blog, 
            _id: insertedId,
            createdAt: blog.createdAt ?? new Date().toISOString(),
            isMembership: blog.isMembership ?? true,
        };
    },

    async updateBlogById(id: string, blog: TBlogDTO): Promise<WithId<TBlog> | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        return await blogsRepository.updateBlogById(id, blog);
    },

    async deleteBlogById(id: string): Promise<string | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedBlog = await blogsRepository.deleteBlogById(id);

        if (deletedBlog.deletedCount < 1) {
            return null;
        };

        return id;
    }
};
