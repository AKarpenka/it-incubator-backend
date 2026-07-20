import { Request, Response } from 'express';
import { TBlogDTO } from '../../application/dto/blogs-input.dto';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { mapToBlogsViewModel } from '../mappers/map-to-blogs-view-model.util';
import { BlogsService } from '../../application/blogs.service';
import { TPostDTO } from '../../../posts/application/dto/posts-input.dto';
import { mapToPostsViewModel } from '../../../posts/routers/mapper/map-to-posts-view-model.utils';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { TBlogQueryInput } from '../../types/blog';
import { mapToBlogsViewModelPaginated } from '../mappers/map-to-blogs-view-model-paginated.util';
import { TPostQueryInput } from '../../../posts/types/post';
import { mapToPostsViewModelPaginated } from '../../../posts/routers/mapper/map-to-posts-view-model-paginated.utils';
import { PostsService } from '../../../posts/application/posts.service';

export class BlogsController {
    private blogsService: BlogsService;
    private postsService: PostsService;

    constructor() {
        this.blogsService = new BlogsService();
        this.postsService = new PostsService();
    }

    async createBlogHandler(req: Request<{}, {}, TBlogDTO>, res: Response) {
        try {
            const newBlog = await this.blogsService.createBlog(req.body);

            const newBlogViewModel = mapToBlogsViewModel(newBlog);

            res
                .status(HttpStatus.Created)
                .json(newBlogViewModel)
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async createPostByBlogHandler(req: Request<{ id: string }, {}, TPostDTO>, res: Response) {
        try {
            const newPost = await this.postsService.createPost(req.body, req.params.id);
    
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

    async deleteBlogByIdHandler(req: Request, res: Response) {
        try {
            const deletedBlogId = await this.blogsService.deleteBlogById(req.params.id);
    
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

    async getBlogsByIdHandler(req: Request, res: Response) {
        try {
            const blog = await this.blogsService.getBlogById(req.params.id);
    
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
    
    async getBlogsHandler(req: Request<{}, {}, {}, Partial<TBlogQueryInput>>, res: Response) {
        try {
            const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    
            const { items, totalCount } = await this.blogsService.getBlogs(queryInput);
                
            const blogsViewModel = mapToBlogsViewModelPaginated(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
    
            res
                .status(HttpStatus.Ok)
                .json(blogsViewModel);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        } 
    }

    async getPostsByBlogHandler(req: Request<{ id: string }, {}, {}, Partial<TPostQueryInput>>, res: Response) {
        try {
            const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
            const blogId = req.params.id;
    
            const blog = await this.blogsService.getBlogById(blogId);
    
            if(!blog) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`Blog for passed id ${blogId} doesn\'t exist`);
                
                return;
            }
    
            const { items, totalCount } = await this.postsService.getPostsByBlogId(blogId, queryInput);
    
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

    async updateBlogByIdHandler(req: Request<{ id: string }, {}, TBlogDTO>, res: Response) {
        try {
            const updatedBlog = await this.blogsService.updateBlogById(req.params.id, req.body);
    
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
    
}