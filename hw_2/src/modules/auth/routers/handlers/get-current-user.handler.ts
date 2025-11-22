import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from 'userId';
import { usersQueryRepository } from '../../../../modules/users/repositories/users.query-repository';
import { mapToCurrentUserViewModel } from '../mappers/map-to-current-user-view-model.utils';

export async function getCurrentUserHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
    try {
        const userId = req.user;

        const { user } = await usersQueryRepository.getUserById(userId);

        if(!user) {
            res
                .status(HttpStatus.NotFound)
                .send(`User was not found`);

            return;
        }

        const currentUser = mapToCurrentUserViewModel(user);

        res                
            .status(HttpStatus.Ok)
            .json(currentUser);

    } catch(error: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}