import { TBlog, TDataBase, TPost } from '../src/types/TDataBase';

export const blog1: TBlog = {
    id: new Date().toISOString() + Math.random(),
    name: "n1",
    description: "description-1",
    websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
} as const;

export const blog7: TBlog = {
    id: new Date().toISOString() + Math.random(),
    name: "n7",
    description: "description-7",
    websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
} as const;

export const post1: TPost = {
    id: new Date().toISOString() + Math.random(),
    title: 't1',
    content: 'c1',
    shortDescription: 's1',
    blogId: blog1.id,
    blogName: 'n1'
} as const;

export const dataset1: TDataBase = {
    blogs: [blog1],
    posts: [],
} as const;

export const dataset2: TDataBase = {
    blogs: [blog1, blog7],
    posts: [post1],
} as const;
