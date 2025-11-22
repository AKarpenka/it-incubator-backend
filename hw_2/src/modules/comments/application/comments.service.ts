import { ObjectId, WithId } from "mongodb";
import { Result } from "../../../core/types/resultTypes";
import { TCommentDTO } from "../dto/comment.dto";
import { TUserId } from "../../../core/types/userId";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { commentsRepository } from "../repositories/comments.repository";
import { TComment, TCommentsQueryInput } from "../types/comment";
import { commentsQueryRepository } from "../repositories/comments.query-repository";
import { TPost } from "../../../modules/posts/types/post";

type TCreateCommentParams = {
    newCommentDTO: TCommentDTO,
    userInfo: TUserId,
    post: WithId<TPost>
};

export const commentsService = {
    createComment: async ({
        newCommentDTO,
        userInfo,
        post,
    }: TCreateCommentParams): Promise<Result<WithId<TComment> | null>> => {
        const { user } = await usersQueryRepository.getUserById(userInfo.id);

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

        const { comment } = await commentsRepository.createComment(newComment);

        return {
            status: Statuses.Success,
            data: comment,
            extensions: [],
        };
    },

    updateCommentById: async (
        id: string, 
        comment: TCommentDTO, 
        user: TUserId
    ): Promise<Result<WithId<TComment> | null>> => {
        const { comment: foundComment} = await commentsQueryRepository.getCommentById(id);

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

        const { comment: newComment} = await commentsRepository.updateCommentById(id, comment);

        return {
            status: Statuses.Success,
            data: newComment,
            extensions: [],
        };
    },

    deleteCommentById: async (id: string, user: TUserId): Promise<Result<{ deletedId: string} | null>> => {
        if (!ObjectId.isValid(id)) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Invalid ID',
                extensions: [{ field: 'id', message: 'Invalid ID' }],
            };
        };

        const { comment: foundComment} = await commentsQueryRepository.getCommentById(id);

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

        const deletedComment = await commentsRepository.deleteCommentById(id);

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
    },

    getCommentsByPostId: async (
        queryDto: TCommentsQueryInput,
        postId: string,
    ): Promise<Result<{ items: WithId<TComment>[]; totalCount: number } | null>> => {
        const result = await commentsQueryRepository.getCommentsByPostId(queryDto, postId);

        return {
            status: Statuses.Success,
            data: result,
            extensions: [],
        };
    }

}