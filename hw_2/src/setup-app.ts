import { authRouter, blogsRouter, commentsRouter, postsRouter, testingRouter, usersRouter } from './modules';
import { SETTINGS } from './core/settings/settings';
import express, { Express } from 'express';
import cors from 'cors';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(cors({
    origin: true, // Разрешаем все источники
    credentials: true, // Разрешаем отправку credentials
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'], // Явно разрешаем заголовок Authorization в обоих регистрах
    exposedHeaders: ['Authorization'], // Разрешаем клиенту читать заголовок Authorization
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Разрешаем все необходимые методы
    preflightContinue: false, // Обрабатываем preflight запросы стандартным образом
    optionsSuccessStatus: 204, // Статус для успешных OPTIONS запросов
  }));

  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.TESTING, testingRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter);

  setupSwagger(app);

  return app;
};