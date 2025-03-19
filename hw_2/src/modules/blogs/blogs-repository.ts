import { Request, Response } from "express";
import { db } from "../../db/db";
import { TBlog } from "TDataBase";
import { v4 as uuid } from "uuid";

export const blogsRepository = {
    getBlogs: (): TBlog[] => db.blogs,
    getBlogById: (id: string): TBlog | undefined => db.blogs.find(blog => blog.id === id),
    createBlog: (body: Record<string, string>): TBlog => {
        const newBlog: TBlog = {
            ...body,
            id: uuid(),
            name: body.name.trim(),
            description: body.description.trim(),
            websiteUrl: body.websiteUrl.trim(), 
        };

        db.blogs = [...db.blogs, newBlog];

        return newBlog;
    },
    updateBlogById: (id: string, body: Record<string, string>): TBlog | null => {
        const { blogs } = db;
        const blogIndex = blogs.findIndex(blog => blog.id === id);

        if(blogIndex !== -1) {
            blogs[blogIndex] = {
                ...blogs[blogIndex],
                ...body,
            };

            return blogs[blogIndex];
        } else { 
            return null;
        }
    },
    deleteVideoById: (id: string): string | null => {
        const { blogs } = db;
        const blogIndex = blogs.findIndex(blog => blog.id === id);

        if(blogIndex !== -1) {
            blogs.splice(blogIndex, 1);

            return id;
        } else { 
            return null;
        }
    }
}