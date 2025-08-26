import { Router, Request, Response } from "express";
import { blogsRepository } from "./blogs-repository";
import { blogsValidatorMiddleware } from "../../middlewares/validation/blogs-validators-middleware";
import { errorsResultMiddleware } from "../../middlewares/validation/errors-result-middleware";
import { authorizationMiddleware } from "../../middlewares/auth/basic-auth-middleware";

export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getBlogs();

    res
        .status(200)
        .json(blogs);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.getBlogById(req.params.id);

    if(blog) {
        res
            .status(200)
            .json(blog);
    } else { 
        res
            .status(404)
            .send(`Blog for passed id ${req.params.id} doesn\'t exist`);
    }
});


blogsRouter.delete('/:id', 
    authorizationMiddleware, 
    async (req: Request, res: Response) => {
    const deletedBlogId = await blogsRepository.deleteVideoById(req.params.id);

    if(deletedBlogId !== null) {
        res
            .status(204)
            .send('Deleted!');
    } else {
        res
            .status(404)
            .send(`Blog for passed id ${req.params.id} doesn\'t exist`);
    }
});

blogsRouter.post('/', 
    authorizationMiddleware, 
    ...blogsValidatorMiddleware,
    errorsResultMiddleware,
    async (req: Request, res: Response) => {
        const newBlog = await blogsRepository.createBlog(req.body);

        res
            .status(201)
            .json(newBlog)
    }
);

blogsRouter.put('/:id', 
    authorizationMiddleware, 
    ...blogsValidatorMiddleware,
    errorsResultMiddleware,
    async (req: Request, res: Response) => {
    const updatedBlog = await blogsRepository.updateBlogById(req.params.id, req.body);

    if(updatedBlog !== null) {
        res
            .status(204)
            .send('Updated!');
    } else {
        res
            .status(404)
            .send(`Blog for passed id ${req.params.id} doesn\'t exist`);
    }
});
