import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { postsService } from '../../application/posts.service';
import { TPostQueryInput } from '../../types/post';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { mapToPostsViewModelPaginated } from '../mapper/map-to-posts-view-model-paginated.utils';

export async function getPostsHandler(req: Request<{}, {}, {}, Partial<TPostQueryInput>>, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await postsService.getPosts(queryInput);

        const postsViewModel = mapToPostsViewModelPaginated(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res
            .status(HttpStatus.Ok)
            .json(postsViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}