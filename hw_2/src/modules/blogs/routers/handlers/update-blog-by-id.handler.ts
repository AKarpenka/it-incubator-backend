import { Request, Response } from 'express';
import { TBlogDTO } from '../../application/dto/blogs-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { blogsService } from '../../application/blogs.service';

export async function updateBlogByIdHandler(req: Request<{ id: string }, {}, TBlogDTO>, res: Response) {
    try {
        const updatedBlog = await blogsService.updateBlogById(req.params.id, req.body);

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
