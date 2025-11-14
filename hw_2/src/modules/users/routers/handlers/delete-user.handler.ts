import { Request, Response } from 'express';
import { usersService } from '../../application/users.service';
import { HttpStatus } from '../../../../core/types/httpStatuses';

export async function deleteUserHandler(req: Request, res: Response) {
    try {
        const deletedUserId = await usersService.deleteUser(req.params.id);

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