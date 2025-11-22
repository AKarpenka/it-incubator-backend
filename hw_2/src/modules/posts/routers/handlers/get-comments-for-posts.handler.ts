import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { commentsService } from '../../../../modules/comments/application/comments.service';
import { CommentsSortBy } from '../../../../modules/comments/constants';
import { mapToCommentsViewModelPaginated } from '../../../../modules/comments/routers/mappers/map-to-posts-view-model-paginated.utils';

export async function getCommentsForPostsHandler(req: Request, res: Response) {
    try {
        const post = await postsService.getPostById(req.params.id);

        if(!post) {
            res
                .status(HttpStatus.NotFound)
                .send(`Post for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        const queryInput = setDefaultSortAndPaginationIfNotExist<CommentsSortBy>(req.query);

        const result = await commentsService.getCommentsByPostId(queryInput, req.params.id);

        if(!result.data) {
            res
                .status(HttpStatus.Forbidden)
                .send(`Something goes wrong during the query`);

            return;
        }

        const commentsViewModel = mapToCommentsViewModelPaginated(result.data.items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: result.data.totalCount,
        });

        res
            .status(HttpStatus.Ok)
            .json(commentsViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}