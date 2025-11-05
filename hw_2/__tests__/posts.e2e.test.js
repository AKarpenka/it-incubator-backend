"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
require("jest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("../src/setup-app");
const settings_1 = require("../src/core/settings/settings");
const httpStatuses_1 = require("../src/core/types/httpStatuses");
const mocks_1 = require("./mocks");
const helpers_1 = require("./helpers");
const generate_admin_auth_token_1 = require("./utils/generate-admin-auth-token");
describe('/posts', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const adminToken = (0, generate_admin_auth_token_1.generateAdminAuthToken)();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
    }));
    it('createPost: should create', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const newPost = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: mocks_1.dataset1.blogs[0].id,
        };
        const res = yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.POSTS)
            .set({ 'Authorization': adminToken })
            .send(newPost)
            .expect(httpStatuses_1.HttpStatus.Created);
        expect(res.body.title).toEqual(newPost.title);
        expect(res.body.shortDescription).toEqual(newPost.shortDescription);
        expect(res.body.content).toEqual(newPost.content);
        expect(res.body.blogId).toEqual(newPost.blogId);
        expect(res.body.blogName).toEqual(mocks_1.dataset1.blogs[0].name);
        expect(typeof res.body.id).toEqual('string');
        expect(res.body.createdAt).toBeDefined();
        // Проверяем, что _id отсутствует в ответе API
        expect(res.body._id).toBeUndefined();
    }));
    it('createPost: shouldn\'t create 401', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const newPost = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: mocks_1.dataset1.blogs[0].id,
        };
        yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
        expect(mocks_1.mockDB.posts.length).toEqual(0);
    }));
    it('createPost: shouldn\'t create (400)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const newPost = {
            title: (0, helpers_1.createString)(31),
            content: (0, helpers_1.createString)(1001),
            shortDescription: (0, helpers_1.createString)(10100),
            blogId: '',
        };
        const res = yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.POSTS)
            .set({ 'Authorization': adminToken })
            .send(newPost)
            .expect(httpStatuses_1.HttpStatus.BadRequest);
        expect(res.body.errorsMessages.length).toEqual(4);
        expect(res.body.errorsMessages[0].field).toEqual('title');
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
        expect(res.body.errorsMessages[2].field).toEqual('content');
        expect(res.body.errorsMessages[3].field).toEqual('blogId');
        expect(mocks_1.mockDB.posts.length).toEqual(0);
    }));
    it('getPosts: should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.POSTS)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.length).toEqual(0);
    }));
    it('getPosts: should get not empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.POSTS)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].title).toEqual(mocks_1.dataset2.posts[0].title);
        expect(res.body[0].shortDescription).toEqual(mocks_1.dataset2.posts[0].shortDescription);
        expect(res.body[0].content).toEqual(mocks_1.dataset2.posts[0].content);
        expect(res.body[0].blogId).toEqual(mocks_1.dataset2.posts[0].blogId);
        expect(res.body[0]._id).toBeUndefined();
    }));
    it('getPost: shouldn\'t find', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.POSTS + '/' + nonExistentId)
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('getPost: should find', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.POSTS + '/' + mocks_1.dataset2.posts[0].id)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.id).toEqual(mocks_1.dataset2.posts[0].id);
        expect(res.body.title).toEqual(mocks_1.dataset2.posts[0].title);
        expect(res.body.shortDescription).toEqual(mocks_1.dataset2.posts[0].shortDescription);
        expect(res.body.content).toEqual(mocks_1.dataset2.posts[0].content);
        expect(res.body.blogId).toEqual(mocks_1.dataset2.posts[0].blogId);
        expect(res.body._id).toBeUndefined();
    }));
    it('deletePost: should del', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.POSTS + '/' + mocks_1.dataset2.posts[0].id)
            .set({ 'Authorization': adminToken })
            .expect(httpStatuses_1.HttpStatus.NoContent);
        expect(mocks_1.mockDB.posts.length).toEqual(0);
    }));
    it('deletePost: shouldn\'t del (404)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.POSTS + '/' + nonExistentId)
            .set({ 'Authorization': adminToken })
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('deletePost: shouldn\'t del (401)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        // Используем валидный ObjectId для проверки авторизации
        const testId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.POSTS + '/' + testId)
            .set({ 'Authorization': 'Basic' + adminToken.replace('Basic ', '') }) // специально без пробела
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
    }));
    it('putPost: should update', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        const post = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            blogId: mocks_1.dataset2.blogs[1].id,
            blogName: mocks_1.dataset2.blogs[1].name,
        };
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.POSTS + '/' + mocks_1.dataset2.posts[0].id)
            .set({ 'Authorization': adminToken })
            .send(post)
            .expect(httpStatuses_1.HttpStatus.NoContent);
        expect(mocks_1.mockDB.posts[0].title).toEqual(post.title);
        expect(mocks_1.mockDB.posts[0].shortDescription).toEqual(post.shortDescription);
        expect(mocks_1.mockDB.posts[0].content).toEqual(post.content);
        expect(mocks_1.mockDB.posts[0].blogId).toEqual(post.blogId);
        expect(mocks_1.mockDB.posts[0].blogName).toEqual(post.blogName);
    }));
    it('putPost: shouldn\'t update (404)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1); // Нужен блог для валидации blogId
        const post = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: mocks_1.dataset1.blogs[0].id,
        };
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.POSTS + '/' + nonExistentId)
            .set({ 'Authorization': adminToken })
            .send(post)
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('putPost: shouldn\'t update (400)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        const post = {
            title: (0, helpers_1.createString)(31),
            content: (0, helpers_1.createString)(1001),
            shortDescription: (0, helpers_1.createString)(101),
            blogId: mocks_1.dataset1.blogs[0].id,
        };
        const res = yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.POSTS + '/' + mocks_1.dataset2.posts[0].id)
            .set({ 'Authorization': adminToken })
            .send(post)
            .expect(httpStatuses_1.HttpStatus.BadRequest);
        expect(mocks_1.mockDB).toEqual(mocks_1.dataset2);
        expect(res.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
        // Проверяем основные ошибки валидации
        const errorFields = res.body.errorsMessages.map((e) => e.field);
        expect(errorFields).toContain('title');
        expect(errorFields).toContain('shortDescription');
        expect(errorFields).toContain('content');
    }));
    it('putPost: shouldn\'t update (401)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset2);
        const post = {
            title: (0, helpers_1.createString)(31),
            content: (0, helpers_1.createString)(1001),
            shortDescription: (0, helpers_1.createString)(101),
            blogId: '1',
        };
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.POSTS + '/' + mocks_1.dataset2.posts[0].id)
            .set({ 'Authorization': adminToken + 'error' })
            .send(post)
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
        expect(mocks_1.mockDB).toEqual(mocks_1.dataset2);
    }));
});
//# sourceMappingURL=posts.e2e.test.js.map