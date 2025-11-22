import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { commentsQueryRepository } from '../../repositories/comments.query-repository';
import { mapToCommentsViewModel } from '../mappers/map-to-comments-view-model';

export async function getCommentsByIdHandler(req: Request, res: Response) {
    try {
        const { comment } = await commentsQueryRepository.getCommentById(req.params.id);

        if(!comment) {
            res
                .status(HttpStatus.NotFound)
                .send(`Comment for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        const commentsViewModel = mapToCommentsViewModel(comment);

        res
            .status(HttpStatus.Ok)
            .send(commentsViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}