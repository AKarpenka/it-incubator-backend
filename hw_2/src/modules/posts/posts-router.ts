import { postsRepository } from './posts-repository';
import { Router, Request, Response } from "express";
import { errorsResultMiddleware } from "../../middlewares/validation/errors-result-middleware";
import { authorizationMiddleware } from "../../middlewares/auth/basic-auth-middleware";
import { postsValidatorMiddleware } from '../../middlewares/validation/posts-validators-middleware';

export const postsRouter = Router();

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getPosts();

    res
        .status(200)
        .json(posts);
});

postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = postsRepository.getPostById(req.params.id);

    if(post) {
        res
            .status(200)
            .json(post);
    } else { 
        res
            .status(404)
            .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    }
});

postsRouter.delete('/:id', 
    authorizationMiddleware, 
    (req: Request, res: Response) => {
    const deletedPostId = postsRepository.deletePostById(req.params.id);

    if(deletedPostId !== null) {
        res
            .status(204)
            .send('Deleted!');
    } else {
        res
            .status(404)
            .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    }
});

postsRouter.post('/', 
    authorizationMiddleware, 
    ...postsValidatorMiddleware,
    errorsResultMiddleware,
    (req: Request, res: Response) => {
    const newPost = postsRepository.createPost(req.body);

    if(newPost) {
        res
            .status(201)
            .json(newPost)
    } else {
        res
            .status(404)
            .send(`Blog for passed blogId doesn\'t exist`);
    }
});

postsRouter.put('/:id', 
    authorizationMiddleware, 
    ...postsValidatorMiddleware,
    errorsResultMiddleware,
    (req: Request, res: Response) => {
    const updatedPost = postsRepository.updatePostById(req.params.id, req.body);

    if(updatedPost !== null) {
        res
            .status(204)
            .send('Updated!');
    } else {
        res
            .status(404)
            .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    }
});