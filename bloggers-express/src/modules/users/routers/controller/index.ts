import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserDTO } from '../../repositories/dto/users-input.dto';
import { mapToUsersViewModel } from '../mappers/map-to-users-view-model.util';
import { UsersService } from '../../application/users.service';
import { TUserQueryInput } from '../../types/user';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { UsersQueryRepository } from '../../repositories/users.query-repository';
import { mapToUsersViewModelPaginated } from '../mappers/map-to-users-view-model-paginated.util';
import { inject, injectable } from 'inversify';

@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    ) {}

    async createUserHandler(req: Request<{}, {}, TUserDTO>, res: Response) {
        try {
            const { user } = await this.usersService.createUser(req.body, true);

            if(!user) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`User was not created`);

                return;
            }

            const newUserViewModel = mapToUsersViewModel(user);

            res
                .status(HttpStatus.Created)
                .json(newUserViewModel)
        } catch(error: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async deleteUserHandler(req: Request, res: Response) {
        try {
            const deletedUserId = await this.usersService.deleteUser(req.params.id);
    
            if(deletedUserId === null) {
                res
                    .status(HttpStatus.NotFound)
                    .send(`User for passed id ${req.params.id} doesn\'t exist`);
    
                return;
            }
    
            res
                .status(HttpStatus.NoContent)
                .send('Deleted!')
    
        } catch(e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async getUsersHandler(req: Request<{}, {}, {}, Partial<TUserQueryInput>>, res: Response) {
        try {
            const queryInput: TUserQueryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    
            const { items, totalCount } = await this.usersQueryRepository.getUsers(queryInput);
    
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
}