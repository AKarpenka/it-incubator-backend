import { query } from "express-validator";
import { SortDirection, TPaginationAndSorting } from '../../core/types/sortingPagination';

const PAGE_NUMBER_DEFAULT = 1;
const PAGE_SIZE_DEFAULT = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: TPaginationAndSorting<string> = {
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};

export const paginationAndSortingValidation = (SortBy: Record<string, string>) => {
    const allowedSortDirections = Object.values(SortDirection);
    const allowedDiSortBy = Object.values(SortBy);
  
    return [
        query('searchNameTerm')
            .optional()
            .isString()
            .withMessage('searchNameTerm must be a string'),

        query('sortBy')
            .default(Object.values(SortBy)[0])
            .isIn(allowedDiSortBy)
            .withMessage(
                `SortBy must be one of: ${Object.values(SortBy).join(', ')}`,
            ),

        query('sortDirection')
            .default(SortDirection.DESC)
            .isIn(allowedSortDirections)
            .withMessage(
                `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
            ),

        query('pageNumber')
            .default(PAGE_NUMBER_DEFAULT)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),

        query('pageSize')
            .default(PAGE_SIZE_DEFAULT)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),
    ]
  }