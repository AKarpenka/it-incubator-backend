import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { postsService } from '../../application/posts.service';

export async function deletePostByIdHandler(req: Request, res: Response) {
    try {
        const deletedPostId = await postsService.deletePostById(req.params.id);

        if(deletedPostId === null) {
            res
                .status(HttpStatus.NotFound)
                .send(`Post for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        res
            .status(HttpStatus.NoContent)
            .send('Deleted!');
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
