import { WithId } from 'mongodb';
import { TPost } from '../../types/post';
import { TPostViewModel } from '../../types/post-view-model';

export function mapToPostsViewModel(post: WithId<TPost>): TPostViewModel {
  return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
  }
}