import { TPaginationAndSorting } from "../../../core/types/sortingPagination";
import { BlogsSortBy } from "../constants";

export type TBlog = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt?: string,
    isMembership?: boolean,
}

export type TBlogQueryInput = TPaginationAndSorting<BlogsSortBy> & {
    searchNameTerm?: string;
};