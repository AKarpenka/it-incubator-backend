"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataset2 = exports.dataset1 = exports.post1 = exports.blog7 = exports.blog1 = exports.mockDB = void 0;
const mongodb_1 = require("mongodb");
exports.mockDB = {
    blogs: [],
    posts: [],
};
const now = new Date().toISOString();
// Генерируем фиксированные валидные MongoDB ObjectId для тестов
// Используем фиксированные hex строки для воспроизводимости тестов
const blog1Id = new mongodb_1.ObjectId('507f1f77bcf86cd799439011').toString();
const blog7Id = new mongodb_1.ObjectId('507f1f77bcf86cd799439012').toString();
const post1Id = new mongodb_1.ObjectId('507f1f77bcf86cd799439013').toString();
exports.blog1 = {
    id: blog1Id,
    name: "n1",
    description: "description-1",
    websiteUrl: "https://example.com/1",
    createdAt: now,
    isMembership: false
};
exports.blog7 = {
    id: blog7Id,
    name: "n7",
    description: "description-7",
    websiteUrl: "https://example.com/7",
    createdAt: now,
    isMembership: true
};
exports.post1 = {
    id: post1Id,
    title: 't1',
    content: 'c1',
    shortDescription: 's1',
    blogId: exports.blog1.id,
    blogName: exports.blog1.name,
    createdAt: now
};
exports.dataset1 = {
    blogs: [exports.blog1],
    posts: [],
};
exports.dataset2 = {
    blogs: [exports.blog1, exports.blog7],
    posts: [exports.post1],
};
//# sourceMappingURL=mocks.js.map