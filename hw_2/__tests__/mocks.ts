import { TBlogViewModel } from "../src/modules/blogs/types/blog-view-model";
import { TPostViewModel } from "../src/modules/posts/types/post-view-model";

export type TDataBase = {
    blogs: TBlogViewModel[],
    posts: TPostViewModel[],
}

import { ObjectId } from 'mongodb';

export const mockDB: TDataBase = {
    blogs: [],
    posts: [],
};

const now = new Date().toISOString();

// Генерируем фиксированные валидные MongoDB ObjectId для тестов
// Используем фиксированные hex строки для воспроизводимости тестов
const blog1Id = new ObjectId('507f1f77bcf86cd799439011').toString();
const blog7Id = new ObjectId('507f1f77bcf86cd799439012').toString();
const post1Id = new ObjectId('507f1f77bcf86cd799439013').toString();

export const blog1: TBlogViewModel = {
    id: blog1Id,
    name: "n1",
    description: "description-1",
    websiteUrl: "https://example.com/1",
    createdAt: now,
    isMembership: false
} as const;

export const blog7: TBlogViewModel = {
    id: blog7Id,
    name: "n7",
    description: "description-7",
    websiteUrl: "https://example.com/7",
    createdAt: now,
    isMembership: true
} as const;

export const post1: TPostViewModel = {
    id: post1Id,
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
