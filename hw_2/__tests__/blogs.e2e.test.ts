/// <reference types="jest" />
import 'jest';
import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { SETTINGS } from '../src/core/settings/settings';
import { HttpStatus } from '../src/core/types/httpStatuses';
import { TBlog } from '../src/modules/blogs/types/blog';
import { dataset1, mockDB } from './mocks';
import { createString, setMockDB } from './helpers';
import { generateAdminAuthToken } from './utils/generate-admin-auth-token';

type TBlogInputModel = Pick<TBlog, 'description' | 'name' | 'websiteUrl'>;

describe('/blogs', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    setMockDB();
  });

  it('createBlog: should create', async () => {
    setMockDB();

    const newBlog: TBlogInputModel = {
      name: "n1",
      description: "description-1",
      websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
    };

    const res = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ 'Authorization': adminToken })
      .send(newBlog)
      .expect(HttpStatus.Created);

    expect(res.body.name).toEqual(newBlog.name);
    expect(res.body.description).toEqual(newBlog.description);
    expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);
    expect(typeof res.body.id).toEqual('string');
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.isMembership).toBeDefined();
    expect(res.body.isMembership).toBe(false);
    
    // Проверяем, что _id отсутствует в ответе API
    expect(res.body._id).toBeUndefined();
  });

  it('createBlog: shouldn\'t create 401', async () => {
    setMockDB();

    const newBlog: TBlogInputModel = {
      name: "n1",
      description: "description-1",
      websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
    };

    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog)
      .expect(HttpStatus.Unauthorized);

    expect(mockDB.blogs.length).toEqual(0);
  });

  it('createBlog: shouldn\'t create (400)', async () => {
    setMockDB();
    
    const newBlog: TBlogInputModel = {
      name: createString(17),
      description: createString(505),
      websiteUrl: createString(10001),
    };

    const res = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ 'Authorization': adminToken })
      .send(newBlog)
      .expect(HttpStatus.BadRequest);

    expect(res.body.errorsMessages.length).toEqual(3);
    expect(res.body.errorsMessages[0].field).toEqual('name');
    expect(res.body.errorsMessages[1].field).toEqual('description');
    expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');

    expect(mockDB.blogs.length).toEqual(0);
  });

  it('getBlogs: should get empty array', async () => {
    setMockDB();

    const res = await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .expect(HttpStatus.Ok);

    expect(res.body.length).toEqual(0);
  });
  
  it('getBlogs: should get not empty array', async () => {
    setMockDB(dataset1);

    const res = await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .expect(HttpStatus.Ok);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(dataset1.blogs[0].name);
    expect(res.body[0].description).toEqual(dataset1.blogs[0].description);
    expect(res.body[0].websiteUrl).toEqual(dataset1.blogs[0].websiteUrl);
    expect(res.body[0]._id).toBeUndefined();
  });

  it('getBlog: shouldn\'t find', async () => {
    setMockDB(dataset1);

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .get(SETTINGS.PATH.BLOGS + '/' + nonExistentId)
      .expect(HttpStatus.NotFound);
  });

  it('getBlog: should find', async () => {
    setMockDB(dataset1);

    const res = await request(app)
      .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
      .expect(HttpStatus.Ok);

    expect(res.body.id).toEqual(dataset1.blogs[0].id);
    expect(res.body.name).toEqual(dataset1.blogs[0].name);
    expect(res.body.description).toEqual(dataset1.blogs[0].description);
    expect(res.body.websiteUrl).toEqual(dataset1.blogs[0].websiteUrl);
    expect(res.body._id).toBeUndefined();
  });

  it('deleteBlog: should del', async () => {
    setMockDB(dataset1);

    await request(app)
      .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
      .set({ 'Authorization': adminToken })
      .expect(HttpStatus.NoContent);

    expect(mockDB.blogs.length).toEqual(0);
  });

  it('deleteBlog: shouldn\'t del (404)', async () => {
    setMockDB();

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .delete(SETTINGS.PATH.BLOGS + '/' + nonExistentId)
      .set({ 'Authorization': adminToken })
      .expect(HttpStatus.NotFound);
  });

  it('deleteBlog: shouldn\'t del (401)', async () => {
    setMockDB();

    // Используем валидный ObjectId для проверки авторизации
    const testId = '507f1f77bcf86cd799439099';
    await request(app)
      .delete(SETTINGS.PATH.BLOGS + '/' + testId)
      .set({ 'Authorization': 'Basic' + adminToken.replace('Basic ', '') }) // без пробела
      .expect(HttpStatus.Unauthorized);
  });

  it('updateBlog: should update', async () => {
    setMockDB(dataset1);

    const blog: TBlogInputModel = {
      name: "n2",
      description: "description-2",
      websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
    };

    await request(app)
      .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
      .set({ 'Authorization': adminToken })
      .send(blog)
      .expect(HttpStatus.NoContent);

    // Проверяем, что блог обновился 
    expect(mockDB.blogs[0].name).toEqual(blog.name);
    expect(mockDB.blogs[0].description).toEqual(blog.description);
    expect(mockDB.blogs[0].websiteUrl).toEqual(blog.websiteUrl);
  });

  it('updateBlog: shouldn\'t update (404)', async () => {
    setMockDB();

    const blog: TBlogInputModel = {
      name: "n1",
      description: "description-1",
      websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
    };

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .put(SETTINGS.PATH.BLOGS + '/' + nonExistentId)
      .set({ 'Authorization': adminToken })
      .send(blog)
      .expect(HttpStatus.NotFound);
  });

  it('updateBlog: shouldn\'t update (400)', async () => {
    setMockDB(dataset1);

    const blog: TBlogInputModel = {
      name: '',
      description: '',
      websiteUrl: '',
    };

    const res = await request(app)
      .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
      .set({ 'Authorization': adminToken })
      .send(blog)
      .expect(HttpStatus.BadRequest);

    expect(mockDB).toEqual(dataset1);
    expect(res.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
    // Проверяем основные ошибки валидации
    const errorFields = res.body.errorsMessages.map((e: any) => e.field);
    expect(errorFields).toContain('name');
    expect(errorFields).toContain('description');
    expect(errorFields).toContain('websiteUrl');
  });

  it('updateBlog: shouldn\'t update (401)', async () => {
    setMockDB(dataset1);

    const blog: TBlogInputModel = {
      name: "n1",
      description: "description-1",
      websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
    };

    await request(app)
      .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
      .set({ 'Authorization': adminToken + 'error' })
      .send(blog)
      .expect(HttpStatus.Unauthorized);

    expect(mockDB).toEqual(dataset1);
  });
});
