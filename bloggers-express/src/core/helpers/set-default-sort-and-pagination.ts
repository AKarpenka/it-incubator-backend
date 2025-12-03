import { TPaginationAndSorting } from "../types/sortingPagination";
import { paginationAndSortingDefault } from "../../middlewares/validation/pagination-sorting-validation.middleware";

export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<TPaginationAndSorting<P>>,
  ): TPaginationAndSorting<P> {
    return {
      ...paginationAndSortingDefault,
      ...query,
      sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
};
