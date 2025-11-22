import { Response, Request } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { commentsService } from '../../application/comments.service';
import { Statuses } from '../../../../core/types/resultStasuses';

export async function deleteCommentByIdHandler(req: Request, res: Response) {
    try {
        const result = await commentsService.deleteCommentById(req.params.id, req.user);
        
        if (result.status !== Statuses.Success) {
            switch (result.status) {
                case Statuses.NotFound:
                    res
                        .status(HttpStatus.NotFound)
                        .send(result.extensions);
                    return;

                case Statuses.Forbidden:
                    res
                        .status(HttpStatus.Forbidden)
                        .send(result.extensions);
                    return;
            
                default:
                    return;
            }
        }

        res
            .status(HttpStatus.NoContent)
            .send('Deleted!');
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}