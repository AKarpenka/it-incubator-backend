export type TUserViewModel = {
    id: string,
    login: string,
    email: string;
    createdAt: string;
}

export type TUserViewModelPaginated = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: TUserViewModel[],
}