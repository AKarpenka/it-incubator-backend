import { TBlog } from "../src/modules/blogs/types/blog";
import { TPost } from "../src/modules/posts/types/post";

export type TDataBase = {
    blogs: TBlog[],
    posts: TPost[],
}

export const mockDB: TDataBase = {
    blogs: [],
    posts: [],
};

const now = new Date().toISOString();

export const blog1: TBlog = {
    id: 'blog-1',
    name: "n1",
    description: "description-1",
    websiteUrl: "https://example.com/1",
    createdAt: now,
    isMembership: false
} as const;

export const blog7: TBlog = {
    id: 'blog-7',
    name: "n7",
    description: "description-7",
    websiteUrl: "https://example.com/7",
    createdAt: now,
    isMembership: true
} as const;

export const post1: TPost = {
    id: 'post-1',
    title: 't1',
    content: 'c1',
    shortDescription: 's1',
    blogId: blog1.id,
    blogName: blog1.name,
    createdAt: now
} as const;

export const dataset1: TDataBase = {
    blogs: [blog1],
    posts: [],
} as const;

export const dataset2: TDataBase = {
    blogs: [blog1, blog7],
    posts: [post1],
} as const;
