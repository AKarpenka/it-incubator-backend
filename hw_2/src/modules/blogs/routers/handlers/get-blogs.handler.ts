import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { blogsService } from '../../application/blogs.service';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { TBlogQueryInput } from '../../types/blog';
import { mapToBlogsViewModelPaginated } from '../mappers/map-to-blogs-view-model-paginated.util';

export async function getBlogsHandler(req: Request<{}, {}, {}, Partial<TBlogQueryInput>>, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await blogsService.getBlogs(queryInput);
            
        const blogsViewModel = mapToBlogsViewModelPaginated(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(blogsViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}