import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../../core/types/httpStatuses';

export async function deleteBlogByIdHandler(req: Request, res: Response) {
    try {
        const deletedBlogId = await blogsRepository.deleteBlogById(req.params.id);

        if(deletedBlogId === null) {
            res
                .status(HttpStatus.NotFound)
                .send(`Blog for passed id ${req.params.id} doesn\'t exist`);

            return;
        }

        res
            .status(HttpStatus.NoContent)
            .send('Deleted!')

    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
