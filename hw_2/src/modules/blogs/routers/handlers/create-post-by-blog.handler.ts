import { Request, Response } from 'express';
import { TPostDTO } from '../../../posts/application/dto/posts-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostsViewModel } from '../../../posts/routers/mapper/map-to-posts-view-model.utils';

export async function createPostByBlogHandler(req: Request<{ id: string }, {}, TPostDTO>, res: Response) {
    try {
        const newPost = await postsService.createPost(req.body, req.params.id);

        if(!newPost) {
            res
                .status(HttpStatus.NotFound)
                .send(`Blog for passed blogId doesn\'t exist`);

            return;
        }

        
        const postViewModel = mapToPostsViewModel(newPost);

        res
            .status(HttpStatus.Created)
            .json(postViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}