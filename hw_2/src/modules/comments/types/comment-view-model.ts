export type TCommentatorInfoViewModel = {
    userId: string;
    userLogin: string;
}

export type TCommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: TCommentatorInfoViewModel;
    createdAt: string;
}

export type TCommentViewModelPaginated = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: TCommentViewModel[],
}