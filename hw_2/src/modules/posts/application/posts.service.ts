import { ObjectId, WithId } from "mongodb";
import { postsRepository } from "../repositories/posts.repository";
import { TPost, TPostQueryInput } from "../types/post";
import {  TPostDTO } from "./dto/posts-input.dto";
import { blogsRepository } from "../../../modules/blogs/repositories/blogs.repository";
import { TBlog } from "../../../modules/blogs/types/blog";

export const postsService = {
    getPosts: async (queryDto: TPostQueryInput): Promise<{ items: WithId<TPost>[]; totalCount: number }> => {
        return await postsRepository.getPosts(queryDto);
    },

    getPostById: async (id: string): Promise<WithId<TPost> | null> => {
        if (!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        return await postsRepository.getPostById(id);
    },

    getPostsByBlogId: async (
        blogId: string, 
        queryDto: TPostQueryInput
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> => {
        return await postsRepository.getPosts(queryDto, blogId);
    },

    createPost: async (post: TPostDTO, blogId?: string): Promise<WithId<TPost> | null> => {
        let blog: WithId<TBlog> | null = null;

        if(blogId) {
            blog = await blogsRepository.getBlogById(blogId);
        } else if (post.blogId) {
            blog = await blogsRepository.getBlogById(post.blogId);
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

        return await postsRepository.createPost(newPost);
    },

    updatePostById: async (id: string, post: TPostDTO): Promise<WithId<TPost> | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        return await postsRepository.updatePostById(id, post);
    },

    deletePostById: async (id: string): Promise<string | null> => {
        if (!ObjectId.isValid(id)) {
            return null;
        };

        const deletedBlog = await postsRepository.deletePostById(id);

        
        if (deletedBlog.deletedCount < 1) {
            return null;
        }

        return id;
    },
};
