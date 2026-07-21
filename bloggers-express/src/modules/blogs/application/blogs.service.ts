import { ObjectId, WithId } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import { TBlog, TBlogQueryInput } from "../types/blog";
import { TBlogDTO } from "./dto/blogs-input.dto";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async getBlogs(queryDto: TBlogQueryInput): Promise<{ items: WithId<TBlog>[]; totalCount: number }> {
        return await this.blogsRepository.getBlogs(queryDto);
    }

    async getBlogById(id: string): Promise<WithId<TBlog> | null> {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        return await this.blogsRepository.getBlogById(id);
    }

    async createBlog(blog: TBlog): Promise<WithId<TBlog>> {
        const newBlog: TBlog = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const insertedId = await this.blogsRepository.createBlog(newBlog);

        return {
            ...newBlog, 
            _id: insertedId,
        };
    }

    async updateBlogById(id: string, blog: TBlogDTO): Promise<WithId<TBlog> | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        return await this.blogsRepository.updateBlogById(id, blog);
    }

    async deleteBlogById(id: string): Promise<string | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedBlog = await this.blogsRepository.deleteBlogById(id);

        if (deletedBlog.deletedCount < 1) {
            return null;
        };

        return id;
    }
};
