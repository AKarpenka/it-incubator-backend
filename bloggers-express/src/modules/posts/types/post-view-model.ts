import { TPost } from "./post";

export type TPostViewModel = TPost & {
    id: string,
}

export type TPostViewModelPaginated = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: TPostViewModel[],
}