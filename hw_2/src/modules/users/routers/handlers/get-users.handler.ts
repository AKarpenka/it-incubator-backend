import { Request, Response } from 'express';
import { TUserQueryInput } from '../../types/user';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { usersQueryRepository } from '../../repositories/users.query-repository';
import { mapToUsersViewModelPaginated } from '../mappers/map-to-users-view-model-paginated.util';

export async function getUsersHandler(req: Request<{}, {}, {}, Partial<TUserQueryInput>>, res: Response) {
    try {
        const queryInput: TUserQueryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await usersQueryRepository.getUsers(queryInput);

        const usersViewModel = mapToUsersViewModelPaginated(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res
            .status(HttpStatus.Ok)
            .json(usersViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}