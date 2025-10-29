import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToPostsViewModel } from '../mapper/map-to-posts-view-model.utils';

export async function getPostByIdHandler(req: Request, res: Response) {
    try{
        const post = await postsRepository.getPostById(req.params.id);

        if(!post) {
            res
                .status(HttpStatus.NotFound)
                .send(`Post for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        const postsViewModel = mapToPostsViewModel(post);

        res
            .status(HttpStatus.Ok)
            .json(postsViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
