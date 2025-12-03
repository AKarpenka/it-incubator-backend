import { TBlog } from "./blog";

export type TBlogViewModel = TBlog & {
    id: string,
};

export type TBlogViewModelPaginated = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: TBlogViewModel[],
}
