import { blogsRouter, postsRouter, testingRouter } from './modules';
import { SETTINGS } from './core/settings/settings';
import express, { Express } from 'express';
import cors from 'cors';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(cors());

  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.TESTING, testingRouter);

  setupSwagger(app);

  return app;
};