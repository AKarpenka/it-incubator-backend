import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { blogsService } from '../../application/blogs.service';
import { postsService } from '../../../posts/application/posts.service';
import { TPostQueryInput } from '../../../../modules/posts/types/post';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { mapToPostsViewModelPaginated } from '../../../../modules/posts/routers/mapper/map-to-posts-view-model-paginated.utils';

export async function getPostsByBlogHandler(req: Request<{ id: string }, {}, {}, Partial<TPostQueryInput>>, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
        const blogId = req.params.id;

        const blog = await blogsService.getBlogById(blogId);

        if(!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(`Blog for passed id ${blogId} doesn\'t exist`);
            
            return;
        }

        const { items, totalCount } = await postsService.getPostsByBlogId(blogId, queryInput);

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