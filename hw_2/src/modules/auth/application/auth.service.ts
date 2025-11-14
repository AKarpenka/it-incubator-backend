import { argon2Service } from './argon2.service';
import { Result } from "../../../core/types/resultTypes";
import { Statuses } from "../../../core/types/resultStasuses";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query-repository";
import { WithId } from "mongodb";
import { TUser } from "../../../modules/users/types/user";

export const authService = {
    loginUser: async (loginOrEmail: string, password: string): Promise<Result<WithId<TUser> | null>> => {
        const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);

        if(!user) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };
        }

        const isPasswordCorrect = await argon2Service.checkPassword(password, user.password);

        if(!isPasswordCorrect) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Wrong password',
                extensions: [{ field: 'password', message: 'Wrong password' }],
            };
        }

        return {
            status: Statuses.Success,
            data: user,
            extensions: [],
        };
    }
}