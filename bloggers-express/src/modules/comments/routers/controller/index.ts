import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { CommentsQueryRepository } from '../../repositories/comments.query-repository';
import { mapToCommentsViewModel } from '../mappers/map-to-comments-view-model';
import { CommentsService } from '../../application/comments.service';
import { Statuses } from '../../../../core/types/resultStasuses';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(CommentsService) protected commentsService: CommentsService,
    ) {}

    async getCommentsByIdHandler(req: Request, res: Response) {
        try {
            const { comment } = await this.commentsQueryRepository.getCommentById(req.params.id);

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

    async deleteCommentByIdHandler(req: Request, res: Response) {
        try {
            const result = await this.commentsService.deleteCommentById(req.params.id, req.user);
            
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

    async updateCommentHandler (req: Request, res: Response) {
        try {
            const result = await this.commentsService.updateCommentById(req.params.id, req.body, req.user);
    
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
                .send('Updated!');
        } catch { 
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }
}