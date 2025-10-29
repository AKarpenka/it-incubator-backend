import { Request, Response } from 'express';
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToBlogsViewModel } from '../mappers/map-to-blogs-view-model.util';

export async function getBlogsHandler(req: Request, res: Response) {
    try {
        const blogs = await blogsRepository.getBlogs();
            
        const blogsViewModel = blogs.map(mapToBlogsViewModel);

        res.send(blogsViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}