import { PostsService } from "./posts/application/posts.service";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsController } from "./blogs/routers/controller";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { PostsRepository } from "./posts/repositories/posts.repository";
import { Container } from "inversify";
import { JwtService } from "../core/adapters/jwt.service";
import { Argon2Service } from "../core/adapters/argon2.service";
import { NodemailerService } from "../core/adapters/nodemailer.service";
import { AuthService } from "./auth/application/auth.service";
import { AuthController } from "./auth/routers/controller";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsQueryRepository } from "./comments/repositories/comments.query-repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { CommentsController } from "./comments/routers/controller";
import { DevicesService } from "./devices/application/devices.service";
import { DevicesQueryRepository } from "./devices/repositories/devices.query-repository";
import { DevicesRepository } from "./devices/repositories/devices.repository";
import { DevicesController } from "./devices/routers/controller";
import { PostsController } from "./posts/routers/controller";
import { RateLimitService } from "./rateLimit/application/rate-limit.service";
import { RateLimitQueryRepository } from "./rateLimit/repositories/rate-limit.query-repository";
import { RateLimitRepository } from "./rateLimit/repositories/rate-limit.repository";
import { UsersService } from "./users/application/users.service";
import { UsersRepository } from "./users/repositories/user.repository";
import { UsersQueryRepository } from "./users/repositories/users.query-repository";
import { UsersController } from "./users/routers/controller";

/* INFO: Пример моего собственного контейнера ioc для DI */
/*
const objects: any[] = [];

//-----repositories
const blogsRepository = new BlogsRepository();
objects.push(blogsRepository);

const postsRepository = new PostsRepository();
objects.push(postsRepository);


// ----services
const blogsService = new BlogsService(blogsRepository);
objects.push(blogsService);

const postsService = new PostsService(blogsRepository, postsRepository);
objects.push(blogsService);


// ----controllers
const blogsController = new BlogsController(blogsService, postsService);
objects.push(blogsController);


export const ioc = {
    getInstance<T>(ClassType: any) {
        return objects.find(obj => obj instanceof ClassType);
    }
}
*/

export const container: Container = new Container();

// --- repositories ---
container.bind(BlogsRepository).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(CommentsQueryRepository).toSelf();
container.bind(CommentsRepository).toSelf();
container.bind(DevicesQueryRepository).toSelf();
container.bind(DevicesRepository).toSelf();
container.bind(RateLimitQueryRepository).toSelf();
container.bind(RateLimitRepository).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(UsersQueryRepository).toSelf();

// --- servises ---
container.bind(BlogsService).toSelf();
container.bind(JwtService).toSelf();
container.bind(Argon2Service).toSelf();
container.bind(NodemailerService).toSelf();
container.bind(AuthService).toSelf();
container.bind(CommentsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(DevicesService).toSelf();
container.bind(RateLimitService).toSelf();
container.bind(UsersService).toSelf();

// --- controllers ---
container.bind(BlogsController).toSelf();
container.bind(AuthController).toSelf();
container.bind(CommentsController).toSelf();
container.bind(DevicesController).toSelf();
container.bind(PostsController).toSelf();
container.bind(UsersController).toSelf();
