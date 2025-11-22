import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { postsService } from '../../application/posts.service';
import { commentsService } from '../../../../modules/comments/application/comments.service';
import { Statuses } from '../../../../core/types/resultStasuses';
import { mapToCommentsViewModel } from '../../../../modules/comments/routers/mappers/map-to-comments-view-model';

export async function createCommentByPostHandler(req: Request, res: Response) {
    try {
        const post = await postsService.getPostById(req.params.id);

        if(!post) {
            res
                .status(HttpStatus.NotFound)
                .send(`Post for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        const result = await commentsService.createComment({
            newCommentDTO: req.body,
            userInfo: req.user,
            post
        });


        if (result.status !== Statuses.Success) {
            res
                .status(HttpStatus.Unauthorized)
                .send(result.extensions);
                
            return;
        }

        const commentViewModel = mapToCommentsViewModel(result.data!);

        res
            .status(HttpStatus.Created)
            .json(commentViewModel);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}