npm i 

to run app: 
npm run watch - перебилживать ts
npm run dev - обновлять ноду
npm run dev:watch - npm run watch + npm run dev - основная очка входа

как с нуля все это добро собрать:
1. после клонирования репозитория
2. npm i
3. поднять локальную базу через докер:
- установить docker desktop 
- запустить в любой командной строке `docker pull mongo`
- запустить `docker run -d --name my-mongo -p 27017:27017 -v ~/mongodb-data:/data/db mongo`
4. Заполнить env 
5. сбилдить первый раз через npm run build 
6. запустить через docker desktop базу поднятую 
7. npm run dev:watch 
8. в mongodb compass подключить 

Проверка:
потыкать postman 


**About:**
**hw_1** - тестовое прилоение на express.js, на get, post, put, delete методы и базу мидлвар. 

**bloggers-express** - приложение с блогами и постами, где между ними выстроена связь данных через ids. 
Express.js - get, post, put, delete методы
MongoDB - cloud, локальная

TODO тех долг:
перевести все на cqrs 
object result добавить везде
поправить endpoints в readme
добавить описание нормальное
покрыть все тестами


--------------------------------------------------------------------------------
ТЕСТИРОВАНИЕ / ОЧИСТКА ДАННЫХ
--------------------------------------------------------------------------------

DELETE  /api/testing/all-data
Успех: 204 No Content, база очищается.
Auth: не требуется.
Используйте перед прогоном сценариев с «чистого листа».

--------------------------------------------------------------------------------
AUTH — /api/auth
--------------------------------------------------------------------------------

POST  /api/auth/login
Назначение: вход, выдача accessToken в JSON и refreshToken в cookie.
Тело (JSON):
  { "loginOrEmail": "<логин или email>", "password": "<6–20 символов>" }
Опционально: заголовок User-Agent (сохраняется как title устройства).
Успех: 200 OK, тело: { "accessToken": "..." }, Set-Cookie: refreshToken=...
В Postman: включите сохранение cookies после этого запроса.

POST  /api/auth/refresh-token
Назначение: обновить пару токенов по текущему refresh в cookie.
Тело: не требуется.
Заголовки: нужна cookie refreshToken от login/previous refresh.
Успех: 200 OK, { "accessToken": "..." }, новый refreshToken в cookie.

POST  /api/auth/logout
Назначение: выход, удаление сессии устройства, очистка cookie.
Cookie: refreshToken.
Успех: 204 No Content.

GET  /api/auth/me
Назначение: профиль текущего пользователя по access token.
Заголовок: Authorization: Bearer <accessToken>
Успех: 200 OK, объект пользователя (email, login, userId и т.д. по мапперу).

POST  /api/auth/registration
Назначение: регистрация нового пользователя.
Тело (пример валидных полей):
  {
    "login": "user1",
    "password": "password12",
    "email": "user1@mail.com"
  }
(login 3–10 символов, латиница/цифры/_/-; пароль 6–20; email по шаблону)
Успех: ожидаемый сценарий — 204 No Content (письмо с кодом уходит на email,
если настроен SMTP).

POST  /api/auth/registration-confirmation
Назначение: подтверждение email кодом из письма.
Тело: { "code": "<код из письма>" }
Успех: по логике хендлера — успешное подтверждение (см. фактический статус в коде).

POST  /api/auth/registration-email-resending
Назначение: повторная отправка кода на email.
Тело: { "email": "user@mail.com" }
Успех: при валидном неподтверждённом пользователе — согласно хендлеру.

--------------------------------------------------------------------------------
DEVICES (сессии) — /api/devices
--------------------------------------------------------------------------------
Все запросы требуют cookie refreshToken (как после login).

GET  /api/devices/
Назначение: список активных сессий пользователя.
Успех: 200 OK, массив объектов:
  [{ "ip", "title", "lastActiveDate", "deviceId" }, ...]

DELETE  /api/devices/
Назначение: удалить все сессии, кроме текущей (текущая определяется по refresh).
Успех: 204 No Content.

DELETE  /api/devices/:deviceId
Назначение: удалить конкретную сессию по deviceId (из списка GET).
Параметр URL: deviceId (UUID).
Успех: 204 No Content.

--------------------------------------------------------------------------------
USERS — /api/users
--------------------------------------------------------------------------------
Все методы — Basic Auth (admin).

GET  /api/users/
Назначение: список пользователей с пагинацией и сортировкой.
Query: pageNumber (по умолчанию 1), pageSize (по умолчанию 10, макс. 100),
sortDirection (asc | desc), sortBy: createdAt | login | email,
searchNameTerm (опционально, строка поиска — как в express-validator).
Успех: 200 OK, объект с items, totalCount, pagesCount и page-блоком
(см. mapToUsersViewModelPaginated).

POST  /api/users/
Назначение: создать пользователя (админ).
Тело: как при регистрации — login, password, email (см. валидаторы users).
Успех: 201 Created (или статус из createUserHandler).

DELETE  /api/users/:id
Назначение: удалить пользователя по id.
Успех: 204 No Content при успешном удалении.

--------------------------------------------------------------------------------
BLOGS — /api/blogs
--------------------------------------------------------------------------------

GET  /api/blogs/
Публично. Query: pageNumber, pageSize, sortBy, sortDirection, searchNameTerm.
sortBy: createdAt | name | description | websiteUrl | isMembership
Успех: 200 OK, список блогов.

GET  /api/blogs/:id
Публично. Успех: 200 OK, один блог.

GET  /api/blogs/:id/posts
Публично. Посты блога с пагинацией.
sortBy для постов: createdAt | title | shortDescription | content | blogId | blogName
Успех: 200 OK.

POST  /api/blogs/
Basic Auth. Тело:
  {
    "name": "...",           // 1–15 символов
    "description": "...",    // 1–500
    "websiteUrl": "https://..." // до 100, формат https://...
  }
Успех: 201 Created.

PUT  /api/blogs/:id
Basic Auth. Тело: как POST /api/blogs/
Успех: 204 No Content.

DELETE  /api/blogs/:id
Basic Auth.
Успех: 204 No Content.

POST  /api/blogs/:id/posts
Basic Auth. Создать пост внутри блога :id.
Тело (поля поста): title (1–30), shortDescription (1–100), content (1–1000).
Успех: 201 Created.

--------------------------------------------------------------------------------
POSTS — /api/posts
--------------------------------------------------------------------------------

GET  /api/posts/
Публично. Query: пагинация, sortBy для постов (см. выше).
Успех: 200 OK.

GET  /api/posts/:id
Публично. Успех: 200 OK.

GET  /api/posts/:id/comments
Публично. Комментарии к посту.
sortBy: createdAt | content
Успех: 200 OK.

POST  /api/posts/
Basic Auth. Создать пост.
Тело (JSON):
  {
    "title": "...",
    "shortDescription": "...",
    "content": "...",
    "blogId": "<существующий id блога>"
  }
Успех: 201 Created, тело — созданный пост (по хендлеру).

PUT  /api/posts/:id
Basic Auth. Обновить пост.
Успех: 204 No Content.

DELETE  /api/posts/:id
Basic Auth.
Успех: 204 No Content.

POST  /api/posts/:id/comments
Требуется: Bearer accessToken (пользователь).
Тело: { "content": "..." }  // 20–300 символов (по валидатору)
Успех: 201 Created.

--------------------------------------------------------------------------------
COMMENTS — /api/comments
--------------------------------------------------------------------------------

GET  /api/comments/:id
Публично. Один комментарий.
Успех: 200 OK.

PUT  /api/comments/:id
Bearer accessToken. Тело: { "content": "..." } (20–300 символов).
Успех: 204 No Content.

DELETE  /api/comments/:id
Bearer accessToken.
Успех: 204 No Content.

--------------------------------------------------------------------------------
SWAGGER UI
--------------------------------------------------------------------------------

GET  http://localhost:3003/api
Открывает интерактивную документацию (если подключены swagger-файлы).

--------------------------------------------------------------------------------
ПРИМЕР ПОСЛЕДОВАТЕЛЬНОСТИ В POSTMAN (МИНИМАЛЬНЫЙ СЦЕНАРИЙ)
--------------------------------------------------------------------------------

1. DELETE /api/testing/all-data  → 204
2. POST /api/auth/registration  → тело с новым login/email
3. (Опционально) подтверждение email, если требуется для входа
4. POST /api/auth/login  → сохранить accessToken и cookie refreshToken
5. GET  /api/auth/me  → Bearer accessToken → 200
6. GET  /api/devices/  → с cookie → 200, список сессий
7. POST /api/auth/refresh-token  → только cookie → 200, новый access в теле
8. POST /api/blogs/ с Basic Auth → создать блог → 201
9. GET  /api/blogs/ → 200, взять id блога
10. POST /api/blogs/:id/posts с Basic Auth → 201
11. POST /api/posts/:postId/comments с Bearer → создать комментарий → 201
