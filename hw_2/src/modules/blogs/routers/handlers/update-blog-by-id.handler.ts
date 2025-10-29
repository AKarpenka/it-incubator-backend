import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { TBlogDTO } from '../../dto/blogs-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';

export async function updateBlogByIdHandler(req: Request<{ id: string }, {}, TBlogDTO>, res: Response) {
    try {
        const updatedBlog = await blogsRepository.updateBlogById(req.params.id, req.body);

        if(updatedBlog === null) {
            res
                .status(HttpStatus.NotFound)
                .send(`Blog for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        res
            .status(HttpStatus.NoContent)
            .send('Updated!');
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
