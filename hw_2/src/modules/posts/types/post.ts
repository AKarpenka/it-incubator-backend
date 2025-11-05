import { TPaginationAndSorting } from "../../../core/types/sortingPagination";
import { PostsSortBy } from "../constants";

export type TPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt?: string;
}

export type TPostQueryInput = TPaginationAndSorting<PostsSortBy>;