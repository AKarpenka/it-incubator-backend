import { WithId } from 'mongodb';
import { TPost } from '../../types/post';
import { TPostViewModel, TPostViewModelPaginated } from '../../types/post-view-model';

type TMetaParams = {
  pageNumber: number,
  pageSize: number,
  totalCount: number,
}

//ToDo для этого можно сделать query-repo
export function mapToPostsViewModelPaginated(
  posts: WithId<TPost>[],
  meta: TMetaParams,
): TPostViewModelPaginated {
  return {
    pagesCount:	Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map(
      (post): TPostViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }))
  }
}