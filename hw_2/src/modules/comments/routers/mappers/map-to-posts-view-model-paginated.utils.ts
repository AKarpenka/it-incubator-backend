import { WithId } from 'mongodb';
import { TComment } from '../../types/comment';
import { TCommentViewModel, TCommentViewModelPaginated } from '../../types/comment-view-model';

type TMetaParams = {
  pageNumber: number,
  pageSize: number,
  totalCount: number,
}

export function mapToCommentsViewModelPaginated(
  comments: WithId<TComment>[],
  meta: TMetaParams,
): TCommentViewModelPaginated {
  return {
    pagesCount:	Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments.map(
      (comment): TCommentViewModel => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
    }))
  }
}