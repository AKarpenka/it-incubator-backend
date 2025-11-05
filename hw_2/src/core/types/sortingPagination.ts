export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
};

export type TPaginationAndSorting<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};