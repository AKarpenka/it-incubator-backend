import { argon2Service } from './argon2.service';
import { Result } from "../../../core/types/resultTypes";
import { Statuses } from "../../../core/types/resultStasuses";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query-repository";
import { jwtService } from './jwt.service';

export const authService = {
    loginUser: async (loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> => {
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

        const accessToken = jwtService.createToken(user);

        return {
            status: Statuses.Success,
            data: accessToken,
            extensions: [],
        };
    }
}