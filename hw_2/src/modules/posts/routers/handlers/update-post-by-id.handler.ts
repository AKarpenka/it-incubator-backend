import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { postsRepository } from '../../repositories/posts.repository';

export async function updatePostByIdHandler(req: Request, res: Response) {
    try {
        const updatedPost = await postsRepository.updatePostById(req.params.id, req.body);

        if(updatedPost === null) {
            res
                .status(HttpStatus.NotFound)
                .send(`Post for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        res
            .status(HttpStatus.NoContent)
            .send('Updated!');
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}