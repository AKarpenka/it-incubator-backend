import { Request, Response } from 'express';
import { TBlogDTO } from '../../application/dto/blogs-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToBlogsViewModel } from '../mappers/map-to-blogs-view-model.util';
import { blogsService } from '../../application/blogs.service';

export async function createBlogHandler(req: Request<{}, {}, TBlogDTO>, res: Response) {
    try {
        const newBlog = await blogsService.createBlog(req.body);

        const newBlogViewModel = mapToBlogsViewModel(newBlog);

        res
            .status(HttpStatus.Created)
            .json(newBlogViewModel)
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}