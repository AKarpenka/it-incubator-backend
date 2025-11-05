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
describe('/blogs', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const adminToken = (0, generate_admin_auth_token_1.generateAdminAuthToken)();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
    }));
    it('createBlog: should create', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const newBlog = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        };
        const res = yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': adminToken })
            .send(newBlog)
            .expect(httpStatuses_1.HttpStatus.Created);
        expect(res.body.name).toEqual(newBlog.name);
        expect(res.body.description).toEqual(newBlog.description);
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);
        expect(typeof res.body.id).toEqual('string');
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.isMembership).toBeDefined();
        expect(res.body.isMembership).toBe(false);
        // Проверяем, что _id отсутствует в ответе API
        expect(res.body._id).toBeUndefined();
    }));
    it('createBlog: shouldn\'t create 401', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const newBlog = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        };
        yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
        expect(mocks_1.mockDB.blogs.length).toEqual(0);
    }));
    it('createBlog: shouldn\'t create (400)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const newBlog = {
            name: (0, helpers_1.createString)(17),
            description: (0, helpers_1.createString)(505),
            websiteUrl: (0, helpers_1.createString)(10001),
        };
        const res = yield (0, supertest_1.default)(app)
            .post(settings_1.SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': adminToken })
            .send(newBlog)
            .expect(httpStatuses_1.HttpStatus.BadRequest);
        expect(res.body.errorsMessages.length).toEqual(3);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');
        expect(mocks_1.mockDB.blogs.length).toEqual(0);
    }));
    it('getBlogs: should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.length).toEqual(0);
    }));
    it('getBlogs: should get not empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].name).toEqual(mocks_1.dataset1.blogs[0].name);
        expect(res.body[0].description).toEqual(mocks_1.dataset1.blogs[0].description);
        expect(res.body[0].websiteUrl).toEqual(mocks_1.dataset1.blogs[0].websiteUrl);
        expect(res.body[0]._id).toBeUndefined();
    }));
    it('getBlog: shouldn\'t find', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.BLOGS + '/' + nonExistentId)
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('getBlog: should find', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const res = yield (0, supertest_1.default)(app)
            .get(settings_1.SETTINGS.PATH.BLOGS + '/' + mocks_1.dataset1.blogs[0].id)
            .expect(httpStatuses_1.HttpStatus.Ok);
        expect(res.body.id).toEqual(mocks_1.dataset1.blogs[0].id);
        expect(res.body.name).toEqual(mocks_1.dataset1.blogs[0].name);
        expect(res.body.description).toEqual(mocks_1.dataset1.blogs[0].description);
        expect(res.body.websiteUrl).toEqual(mocks_1.dataset1.blogs[0].websiteUrl);
        expect(res.body._id).toBeUndefined();
    }));
    it('deleteBlog: should del', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.BLOGS + '/' + mocks_1.dataset1.blogs[0].id)
            .set({ 'Authorization': adminToken })
            .expect(httpStatuses_1.HttpStatus.NoContent);
        expect(mocks_1.mockDB.blogs.length).toEqual(0);
    }));
    it('deleteBlog: shouldn\'t del (404)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.BLOGS + '/' + nonExistentId)
            .set({ 'Authorization': adminToken })
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('deleteBlog: shouldn\'t del (401)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        // Используем валидный ObjectId для проверки авторизации
        const testId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .delete(settings_1.SETTINGS.PATH.BLOGS + '/' + testId)
            .set({ 'Authorization': 'Basic' + adminToken.replace('Basic ', '') }) // без пробела
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
    }));
    it('updateBlog: should update', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const blog = {
            name: "n2",
            description: "description-2",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        };
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.BLOGS + '/' + mocks_1.dataset1.blogs[0].id)
            .set({ 'Authorization': adminToken })
            .send(blog)
            .expect(httpStatuses_1.HttpStatus.NoContent);
        // Проверяем, что блог обновился 
        expect(mocks_1.mockDB.blogs[0].name).toEqual(blog.name);
        expect(mocks_1.mockDB.blogs[0].description).toEqual(blog.description);
        expect(mocks_1.mockDB.blogs[0].websiteUrl).toEqual(blog.websiteUrl);
    }));
    it('updateBlog: shouldn\'t update (404)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)();
        const blog = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        };
        // Используем валидный, но несуществующий ObjectId
        const nonExistentId = '507f1f77bcf86cd799439099';
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.BLOGS + '/' + nonExistentId)
            .set({ 'Authorization': adminToken })
            .send(blog)
            .expect(httpStatuses_1.HttpStatus.NotFound);
    }));
    it('updateBlog: shouldn\'t update (400)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const blog = {
            name: '',
            description: '',
            websiteUrl: '',
        };
        const res = yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.BLOGS + '/' + mocks_1.dataset1.blogs[0].id)
            .set({ 'Authorization': adminToken })
            .send(blog)
            .expect(httpStatuses_1.HttpStatus.BadRequest);
        expect(mocks_1.mockDB).toEqual(mocks_1.dataset1);
        expect(res.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
        // Проверяем основные ошибки валидации
        const errorFields = res.body.errorsMessages.map((e) => e.field);
        expect(errorFields).toContain('name');
        expect(errorFields).toContain('description');
        expect(errorFields).toContain('websiteUrl');
    }));
    it('updateBlog: shouldn\'t update (401)', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.setMockDB)(mocks_1.dataset1);
        const blog = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        };
        yield (0, supertest_1.default)(app)
            .put(settings_1.SETTINGS.PATH.BLOGS + '/' + mocks_1.dataset1.blogs[0].id)
            .set({ 'Authorization': adminToken + 'error' })
            .send(blog)
            .expect(httpStatuses_1.HttpStatus.Unauthorized);
        expect(mocks_1.mockDB).toEqual(mocks_1.dataset1);
    }));
});
//# sourceMappingURL=blogs.e2e.test.js.map