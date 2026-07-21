import { ObjectId, WithId } from "mongodb";
import { PostsRepository } from "../repositories/posts.repository";
import { TPost, TPostQueryInput } from "../types/post";
import {  TPostDTO } from "./dto/posts-input.dto";
import { BlogsRepository } from "../../../modules/blogs/repositories/blogs.repository";
import { TBlog } from "../../../modules/blogs/types/blog";

export class PostsService {
    constructor(protected blogsRepository: BlogsRepository, protected postsRepository: PostsRepository) {}

    async getPosts (queryDto: TPostQueryInput): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        return await this.postsRepository.getPosts(queryDto);
    }

    async getPostById (id: string): Promise<WithId<TPost> | null> {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        return await this.postsRepository.getPostById(id);
    }

    async getPostsByBlogId (
        blogId: string, 
        queryDto: TPostQueryInput
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
        return await this.postsRepository.getPosts(queryDto, blogId);
    }

    async createPost(post: TPostDTO, blogId?: string): Promise<WithId<TPost> | null> {
        let blog: WithId<TBlog> | null = null;

        if(blogId) {
            blog = await this.blogsRepository.getBlogById(blogId);
        } else if (post.blogId) {
            blog = await this.blogsRepository.getBlogById(post.blogId);
        }

        if(!blog) {
            return null;
        }

        const newPost: TPost = {
            ...post,
            title: post.title.trim(),
            shortDescription: post.shortDescription.trim(),
            content: post.content.trim(),
            blogId: blogId ? blogId.trim() : post.blogId!.trim(),
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
        };

        return await this.postsRepository.createPost(newPost);
    }

    async updatePostById (id: string, post: TPostDTO): Promise<WithId<TPost> | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        return await this.postsRepository.updatePostById(id, post);
    }

    async deletePostById (id: string): Promise<string | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedPost = await this.postsRepository.deletePostById(id);
        
        if (deletedPost.deletedCount < 1) {
            return null;
        }

        return id;
    }
};
