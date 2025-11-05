/// <reference types="jest" />
import 'jest';
import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { SETTINGS } from '../src/core/settings/settings';
import { HttpStatus } from '../src/core/types/httpStatuses';
import { dataset1, dataset2, mockDB } from './mocks';
import { createString, setMockDB } from './helpers';
import { TPost } from '../src/modules/posts/types/post';
import { generateAdminAuthToken } from './utils/generate-admin-auth-token';

type TPostInputModel = Pick<TPost, 'blogId' | 'content' | 'shortDescription' | 'title'>;

describe('/posts', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    setMockDB();
  });

  it('createPost: should create', async () => {
    setMockDB(dataset1);

    const newPost: TPostInputModel = {
      title: 't1',
      shortDescription: 's1',
      content: 'c1',
      blogId: dataset1.blogs[0].id,
    };

    const res = await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': adminToken })
      .send(newPost)
      .expect(HttpStatus.Created);

    expect(res.body.title).toEqual(newPost.title);
    expect(res.body.shortDescription).toEqual(newPost.shortDescription);
    expect(res.body.content).toEqual(newPost.content);
    expect(res.body.blogId).toEqual(newPost.blogId);
    expect(res.body.blogName).toEqual(dataset1.blogs[0].name);
    expect(typeof res.body.id).toEqual('string');
    expect(res.body.createdAt).toBeDefined();
    
    // Проверяем, что _id отсутствует в ответе API
    expect(res.body._id).toBeUndefined();
  });

  it('createPost: shouldn\'t create 401', async () => {
    setMockDB(dataset1);

    const newPost: TPostInputModel = {
      title: 't1',
      shortDescription: 's1',
      content: 'c1',
      blogId: dataset1.blogs[0].id,
    };

    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .send(newPost)
      .expect(HttpStatus.Unauthorized);

    expect(mockDB.posts.length).toEqual(0);
  });

  it('createPost: shouldn\'t create (400)', async () => {
    setMockDB();

    const newPost: TPostInputModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(10100),
      blogId: '',
    };

    const res = await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': adminToken })
      .send(newPost)
      .expect(HttpStatus.BadRequest);

    expect(res.body.errorsMessages.length).toEqual(4);
    expect(res.body.errorsMessages[0].field).toEqual('title');
    expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
    expect(res.body.errorsMessages[2].field).toEqual('content');
    expect(res.body.errorsMessages[3].field).toEqual('blogId');

    expect(mockDB.posts.length).toEqual(0);
  });

  it('getPosts: should get empty array', async () => {
    setMockDB();

    const res = await request(app)
      .get(SETTINGS.PATH.POSTS)
      .expect(HttpStatus.Ok);

    expect(res.body.length).toEqual(0);
  });

  it('getPosts: should get not empty array', async () => {
    setMockDB(dataset2);

    const res = await request(app)
      .get(SETTINGS.PATH.POSTS)
      .expect(HttpStatus.Ok);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].title).toEqual(dataset2.posts[0].title);
    expect(res.body[0].shortDescription).toEqual(dataset2.posts[0].shortDescription);
    expect(res.body[0].content).toEqual(dataset2.posts[0].content);
    expect(res.body[0].blogId).toEqual(dataset2.posts[0].blogId);
    expect(res.body[0]._id).toBeUndefined();
  });

  it('getPost: shouldn\'t find', async () => {
    setMockDB(dataset1);

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .get(SETTINGS.PATH.POSTS + '/' + nonExistentId)
      .expect(HttpStatus.NotFound);
  });

  it('getPost: should find', async () => {
    setMockDB(dataset2);

    const res = await request(app)
      .get(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
      .expect(HttpStatus.Ok);

    expect(res.body.id).toEqual(dataset2.posts[0].id);
    expect(res.body.title).toEqual(dataset2.posts[0].title);
    expect(res.body.shortDescription).toEqual(dataset2.posts[0].shortDescription);
    expect(res.body.content).toEqual(dataset2.posts[0].content);
    expect(res.body.blogId).toEqual(dataset2.posts[0].blogId);
    expect(res.body._id).toBeUndefined();
  });

  it('deletePost: should del', async () => {
    setMockDB(dataset2);

    await request(app)
      .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
      .set({ 'Authorization': adminToken })
      .expect(HttpStatus.NoContent);

    expect(mockDB.posts.length).toEqual(0);
  });

  it('deletePost: shouldn\'t del (404)', async () => {
    setMockDB();

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .delete(SETTINGS.PATH.POSTS + '/' + nonExistentId)
      .set({ 'Authorization': adminToken })
      .expect(HttpStatus.NotFound);
  });

  it('deletePost: shouldn\'t del (401)', async () => {
    setMockDB();

    // Используем валидный ObjectId для проверки авторизации
    const testId = '507f1f77bcf86cd799439099';
    await request(app)
      .delete(SETTINGS.PATH.POSTS + '/' + testId)
      .set({ 'Authorization': 'Basic' + adminToken.replace('Basic ', '') }) // специально без пробела
      .expect(HttpStatus.Unauthorized);
  });

  it('putPost: should update', async () => {
    setMockDB(dataset2);

    const post: TPostInputModel & { blogName: string } = {
      title: 't2',
      shortDescription: 's2',
      content: 'c2',
      blogId: dataset2.blogs[1].id,
      blogName: dataset2.blogs[1].name,
    };

    await request(app)
      .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
      .set({ 'Authorization': adminToken })
      .send(post)
      .expect(HttpStatus.NoContent);

    expect(mockDB.posts[0].title).toEqual(post.title);
    expect(mockDB.posts[0].shortDescription).toEqual(post.shortDescription);
    expect(mockDB.posts[0].content).toEqual(post.content);
    expect(mockDB.posts[0].blogId).toEqual(post.blogId);
    expect(mockDB.posts[0].blogName).toEqual(post.blogName);
  });

  it('putPost: shouldn\'t update (404)', async () => {
    setMockDB(dataset1); // Нужен блог для валидации blogId

    const post: TPostInputModel = {
      title: 't1',
      shortDescription: 's1',
      content: 'c1',
      blogId: dataset1.blogs[0].id,
    };

    // Используем валидный, но несуществующий ObjectId
    const nonExistentId = '507f1f77bcf86cd799439099';
    await request(app)
      .put(SETTINGS.PATH.POSTS + '/' + nonExistentId)
      .set({ 'Authorization': adminToken })
      .send(post)
      .expect(HttpStatus.NotFound);
  });

  it('putPost: shouldn\'t update (400)', async () => {
    setMockDB(dataset2);

    const post: TPostInputModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: dataset1.blogs[0].id,
    };

    const res = await request(app)
      .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
      .set({ 'Authorization': adminToken })
      .send(post)
      .expect(HttpStatus.BadRequest);

    expect(mockDB).toEqual(dataset2);
    expect(res.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
    // Проверяем основные ошибки валидации
    const errorFields = res.body.errorsMessages.map((e: any) => e.field);
    expect(errorFields).toContain('title');
    expect(errorFields).toContain('shortDescription');
    expect(errorFields).toContain('content');
  });

  it('putPost: shouldn\'t update (401)', async () => {
    setMockDB(dataset2);

    const post: TPostInputModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: '1',
    };

    await request(app)
      .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
      .set({ 'Authorization': adminToken + 'error' })
      .send(post)
      .expect(HttpStatus.Unauthorized);

    expect(mockDB).toEqual(dataset2);
  });
});
