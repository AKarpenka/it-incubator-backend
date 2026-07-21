import { PostsService } from "../../../modules/posts/application/posts.service";
import { BlogsService } from "../application/blogs.service";
import { BlogsController } from "./controller";
import { BlogsRepository } from "../repositories/blogs.repository";
import { PostsRepository } from "../../../modules/posts/repositories/posts.repository";

const objects: any[] = [];

// -----repositories
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