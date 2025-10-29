import { Request, Response } from 'express';
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToPostsViewModel } from '../mapper/map-to-posts-view-model.utils';

export async function getPostsHandler(req: Request, res: Response) {
    try {
        const posts = await postsRepository.getPosts();
        
        const postsViewModel = posts.map(mapToPostsViewModel);

        res
            .status(HttpStatus.Ok)
            .json(postsViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}