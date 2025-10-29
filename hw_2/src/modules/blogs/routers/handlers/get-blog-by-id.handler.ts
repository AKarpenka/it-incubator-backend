import { Request, Response } from 'express';
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToBlogsViewModel } from '../mappers/map-to-blogs-view-model.util';

export async function getBlogsByIdHandler(req: Request, res: Response) {
    try {
        const blog = await blogsRepository.getBlogById(req.params.id);

        if(!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(`Blog for passed id ${req.params.id} doesn\'t exist`);
            
            return;
        }

        const blogViewModel = mapToBlogsViewModel(blog);

        res
            .status(HttpStatus.Ok)
            .json(blogViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
