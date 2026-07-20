import { ObjectId, WithId } from "mongodb";
import { Result } from "../../../core/types/resultTypes";
import { TCommentDTO } from "../dto/comment.dto";
import { TUserId } from "../../../core/types/userId";
import { UsersQueryRepository } from "../../../modules/users/repositories/users.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { CommentsRepository } from "../repositories/comments.repository";
import { TComment, TCommentsQueryInput } from "../types/comment";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { TPost } from "../../../modules/posts/types/post";

type TCreateCommentParams = {
    newCommentDTO: TCommentDTO,
    userInfo: TUserId,
    post: WithId<TPost>
};

export class CommentsService {
    private commentsRepository: CommentsRepository;
    private commentsQueryRepository: CommentsQueryRepository;
    private usersQueryRepository: UsersQueryRepository;

    constructor() {
        this.commentsRepository = new CommentsRepository();
        this.commentsQueryRepository = new CommentsQueryRepository();
        this.usersQueryRepository = new UsersQueryRepository();
    }

    async createComment({
        newCommentDTO,
        userInfo,
        post,
    }: TCreateCommentParams): Promise<Result<WithId<TComment> | null>> {
        const { user } = await this.usersQueryRepository.getUserById(userInfo.id);

        if(!user) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'id', message: 'Not Found' }],
            };
        }

        const newComment: TComment = {
            content: newCommentDTO.content,
            commentatorInfo: {
                userId: new ObjectId(user._id),
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: post._id,
        }

        const { comment } = await this.commentsRepository.createComment(newComment);

        return {
            status: Statuses.Success,
            data: comment,
            extensions: [],
        };
    }

    async updateCommentById (
        id: string, 
        comment: TCommentDTO, 
        user: TUserId
    ): Promise<Result<WithId<TComment> | null>> {
        const { comment: foundComment} = await this.commentsQueryRepository.getCommentById(id);

        if(!foundComment) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'id', message: 'Not Found' }],
            };
        }

        if(foundComment.commentatorInfo.userId.toString() !== user.id.toString()) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [{ field: 'userId', message: 'If try edit the comment that is not your own' }],
            }; 
        }

        const { comment: newComment} = await this.commentsRepository.updateCommentById(id, comment);

        return {
            status: Statuses.Success,
            data: newComment,
            extensions: [],
        };
    }

    async deleteCommentById(id: string, user: TUserId): Promise<Result<{ deletedId: string} | null>> {
        if (!ObjectId.isValid(id)) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Invalid ID',
                extensions: [{ field: 'id', message: 'Invalid ID' }],
            };
        };

        const { comment: foundComment} = await this.commentsQueryRepository.getCommentById(id);

        if(!foundComment) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'id', message: 'Not Found' }],
            };
        }

        if(foundComment.commentatorInfo.userId.toString() !== user.id.toString()) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [{ field: 'userId', message: 'If try delete the comment that is not your own' }],
            }; 
        }

        const deletedComment = await this.commentsRepository.deleteCommentById(id);

        if (deletedComment.deletedCount < 1) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [{ field: 'id', message: 'Error during delete' }],
            };
        }

        return {
            status: Statuses.Success,
            data: null,
            extensions: [],
        };
    }

    async getCommentsByPostId(
        queryDto: TCommentsQueryInput,
        postId: string,
    ): Promise<Result<{ items: WithId<TComment>[]; totalCount: number } | null>> {
        const result = await this.commentsQueryRepository.getCommentsByPostId(queryDto, postId);

        return {
            status: Statuses.Success,
            data: result,
            extensions: [],
        };
    }

}