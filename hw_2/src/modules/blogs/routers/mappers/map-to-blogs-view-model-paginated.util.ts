import { WithId } from 'mongodb';
import { TBlog } from '../../types/blog';
import { TBlogViewModel, TBlogViewModelPaginated } from '../../types/blog-view-model';

type TMetaParams = {
  pageNumber: number,
  pageSize: number,
  totalCount: number,
}

//ToDo для этого можно сделать query-repo
export function mapToBlogsViewModelPaginated(
    blogs: WithId<TBlog>[], 
    meta: TMetaParams,
  ): TBlogViewModelPaginated {
  return {
    pagesCount:	Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map(
      (blog): TBlogViewModel => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    })),
  }
}
