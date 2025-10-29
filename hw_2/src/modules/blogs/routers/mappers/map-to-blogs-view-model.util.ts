import { WithId } from 'mongodb';
import { TBlog } from '../../types/blog';
import { TBlogViewModel } from '../../types/blog-view-model';

export function mapToBlogsViewModel(blog: WithId<TBlog>): TBlogViewModel {
  return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
  }
}
