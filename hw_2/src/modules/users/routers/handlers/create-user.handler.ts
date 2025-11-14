import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserDTO } from '../../repositories/dto/users-input.dto';
import { usersService } from '../../application/users.service';
import { mapToUsersViewModel } from '../mappers/map-to-users-view-model.util';

export async function createUserHandler(req: Request<{}, {}, TUserDTO>, res: Response) {
    try {
        const { user } = await usersService.createUser(req.body);

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