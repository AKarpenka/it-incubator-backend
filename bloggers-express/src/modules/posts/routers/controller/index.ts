import { PostsService } from '../../application/posts.service';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { CommentsService } from '../../../comments/application/comments.service';
import { Statuses } from '../../../../core/types/resultStasuses';
import { mapToCommentsViewModel } from '../../../comments/routers/mappers/map-to-comments-view-model';
import { mapToPostsViewModel } from '../mapper/map-to-posts-view-model.utils';
import { TPostDTO } from '../../application/dto/posts-input.dto';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { CommentsSortBy } from '../../../comments/constants';
import { mapToCommentsViewModelPaginated } from '../../../comments/routers/mappers/map-to-posts-view-model-paginated.utils';
import { TPostQueryInput } from '../../types/post';
import { mapToPostsViewModelPaginated } from '../mapper/map-to-posts-view-model-paginated.utils';

export class PostsController {
    private postsService: PostsService;
    private commentsService: CommentsService;

    constructor() {
        this.postsService = new PostsService();
        this.commentsService = new CommentsService();
    }

    async createCommentByPostHandler(req: Request, res: Response) {
        try {
            const post = await this.postsService.getPostById(req.params.id);

            if(!post) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Post for passed id ${req.params.id} doesn\'t exist`);

                return;
            }

            const result = await this.commentsService.createComment({
                newCommentDTO: req.body,
                userInfo: req.user,
                post
            });


            if (result.status !== Statuses.Success) {
                res
                    .status(HttpStatus.Unauthorized)
                    .send(result.extensions);
                    
                return;
            }

            const commentViewModel = mapToCommentsViewModel(result.data!);

            res
                .status(HttpStatus.Created)
                .json(commentViewModel);
        } catch {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async createPostHandler(req: Request<{}, {}, TPostDTO>, res: Response) {
        try {
            const newPost = await this.postsService.createPost(req.body);
    
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

    async deletePostByIdHandler(req: Request, res: Response) {
        try {
            const deletedPostId = await this.postsService.deletePostById(req.params.id);
    
            if(deletedPostId === null) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    
                return;
            }
    
            res
                .status(HttpStatus.NoContent)
                .send('Deleted!');
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async getCommentsForPostsHandler(req: Request, res: Response) {
        try {
            const post = await this.postsService.getPostById(req.params.id);
    
            if(!post) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    
                return;
            }
    
            const queryInput = setDefaultSortAndPaginationIfNotExist<CommentsSortBy>(req.query);
    
            const result = await this.commentsService.getCommentsByPostId(queryInput, req.params.id);
    
            if(!result.data) {
                res
                    .status(HttpStatus.Forbidden)
                    .send(`Something goes wrong during the query`);
    
                return;
            }
    
            const commentsViewModel = mapToCommentsViewModelPaginated(result.data.items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount: result.data.totalCount,
            });
    
            res
                .status(HttpStatus.Ok)
                .json(commentsViewModel);
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async getPostByIdHandler(req: Request, res: Response) {
        try {
            const post = await this.postsService.getPostById(req.params.id);
    
            if(!post) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    
                return;
            }
    
            const postsViewModel = mapToPostsViewModel(post);
    
            res
                .status(HttpStatus.Ok)
                .json(postsViewModel);
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }
    
    async getPostsHandler(req: Request<{}, {}, {}, Partial<TPostQueryInput>>, res: Response) {
        try {
            const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    
            const { items, totalCount } = await this.postsService.getPosts(queryInput);
    
            const postsViewModel = mapToPostsViewModelPaginated(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
    
            res
                .status(HttpStatus.Ok)
                .json(postsViewModel);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async updatePostByIdHandler(req: Request, res: Response) {
        try {
            const updatedPost = await this.postsService.updatePostById(req.params.id, req.body);
    
            if(updatedPost === null) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Post for passed id ${req.params.id} doesn\'t exist`);
    
                return;
            }
    
            res
                .status(HttpStatus.NoContent)
                .send('Updated!');
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }
}