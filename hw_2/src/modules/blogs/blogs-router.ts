import { Router, Request, Response } from "express";
import { blogsRepository } from "./blogs-repository";
import { blogsValidatorMiddleware } from "../../middlewares/validation/blogs-validators-middleware";
import { errorsResultMiddleware } from "../../middlewares/validation/errors-result-middleware";
import { authorizationMiddleware } from "../../middlewares/auth/basic-auth-middleware";

export const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs();

    res
        .status(200)
        .json(blogs);
});

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogsRepository.getBlogById(req.params.id);

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
    (req: Request, res: Response) => {
    const deletedBlogId = blogsRepository.deleteVideoById(req.params.id);

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
    (req: Request, res: Response) => {
    const newBlog = blogsRepository.createBlog(req.body);

    res
        .status(201)
        .json(newBlog)
});

blogsRouter.put('/:id', 
    authorizationMiddleware, 
    ...blogsValidatorMiddleware,
    errorsResultMiddleware,
    (req: Request, res: Response) => {
    const updatedBlog = blogsRepository.updateBlogById(req.params.id, req.body);

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
