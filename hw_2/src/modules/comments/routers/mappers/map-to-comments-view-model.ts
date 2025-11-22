import { WithId } from "mongodb";
import { TComment } from "../../types/comment";
import { TCommentViewModel } from "../../types/comment-view-model";

export function mapToCommentsViewModel(comment: WithId<TComment>): TCommentViewModel {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
    }
}