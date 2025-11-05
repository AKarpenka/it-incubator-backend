import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToPostsViewModel } from '../mapper/map-to-posts-view-model.utils';
import { TPostDTO } from '../../application/dto/posts-input.dto';
import { postsService } from '../../application/posts.service';

export async function createPostHandler(req: Request<{}, {}, TPostDTO>, res: Response) {
    try {
        const newPost = await postsService.createPost(req.body);

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