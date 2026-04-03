import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from 'userId';
import { usersQueryRepository } from '../../../../modules/users/repositories/users.query-repository';
import { mapToCurrentUserViewModel } from '../mappers/map-to-current-user-view-model.utils';

export async function getCurrentUserHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
    try {
        const user: TUserId | undefined = req.user;

        if(!user) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
        
            return;
        }

        const userById = await usersQueryRepository.getUserById(user.id.toString());

        if(!userById.user) {
            res
                .status(HttpStatus.NotFound)
                .send(`User was not found`);

            return;
        }

        const currentUser = mapToCurrentUserViewModel(userById.user);

        res                
            .status(HttpStatus.Ok)
            .json(currentUser);

    } catch(error: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}