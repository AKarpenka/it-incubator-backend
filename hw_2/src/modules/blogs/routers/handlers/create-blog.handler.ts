import { Request, Response } from 'express';
import { blogsRepository } from "../../repositories/blogs.repository";
import { TBlogDTO } from '../../dto/blogs-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToBlogsViewModel } from '../mappers/map-to-blogs-view-model.util';

export async function createBlogHandler(req: Request<{}, {}, TBlogDTO>, res: Response) {
    try {
        const newBlog = await blogsRepository.createBlog(req.body);

        const newBlogViewModel = mapToBlogsViewModel(newBlog);

        res
            .status(HttpStatus.Created)
            .json(newBlogViewModel)
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}