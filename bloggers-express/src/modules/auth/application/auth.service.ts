import { nodemailerService } from './../../../core/adapters/nodemailer.service';
import { argon2Service } from '../../../core/adapters/argon2.service';
import { Result } from "../../../core/types/resultTypes";
import { Statuses } from "../../../core/types/resultStasuses";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query-repository";
import { jwtService } from '../../../core/adapters/jwt.service';
import { usersService } from '../../../modules/users/application/users.service';
import { TUserDTO } from '../../../modules/users/repositories/dto/users-input.dto';
import { SETTINGS } from '../../../core/settings/settings';
import { WithId } from 'mongodb';
import { TUser } from '../../../modules/users/types/user';
import { usersRepository } from '../../../modules/users/repositories/user.repository';
import { devicesRepository } from '../../../modules/devices/repositories/devices.repository';
import { TDevice } from '../../../modules/devices/types/device';
import { v4 as uuid } from 'uuid';
import { devicesQueryRepository } from '../../../modules/devices/repositories/devices.query-repository';

export const authService = {
    loginUser: async (props: {
        loginOrEmail: string, 
        password: string, 
        deviceName: string,
        ip: string,
    }): Promise<Result<{ accessToken: string, refreshToken: string } | null>> => {
        const {
            loginOrEmail, 
            password, 
            deviceName,
            ip,
        } = props;
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

        const userIdStr = user._id.toString();
        const existingDevice = await devicesQueryRepository.getDeviceByParams({
            userId: userIdStr,
            ip,
            title: deviceName,
        });

        const { accessToken } = jwtService.createAccessToken(user);

        if (existingDevice) {
            const { refreshToken } = jwtService.createRefreshToken(userIdStr, existingDevice.deviceId);
            const newRTPayload = jwtService.decodePayloadToken<{ exp: number; iat: number }>(refreshToken);

            await devicesRepository.updateDevice({
                userId: existingDevice.userId,
                deviceId: existingDevice.deviceId,
                title: existingDevice.title,
                ip: existingDevice.ip,
                lastActiveDate: new Date(newRTPayload.iat * 1000).toISOString(),
                expRTDate: new Date(newRTPayload.exp * 1000).toISOString(),
            });

            return {
                status: Statuses.Success,
                data: {
                    accessToken,
                    refreshToken,
                },
                extensions: [],
            };
        }

        const newDevice: TDevice = {
            userId: userIdStr,
            deviceId: uuid(),
            lastActiveDate:  new Date().toISOString(),
            title: deviceName,
            ip,
            expRTDate: '',
        };

        const { refreshToken } = jwtService.createRefreshToken(userIdStr, newDevice.deviceId);

        const rtPayload = jwtService.decodePayloadToken<{ exp: number; iat: number }>(refreshToken);

        await devicesRepository.createNewDevice({
            ...newDevice,
            lastActiveDate: new Date(rtPayload.iat * 1000).toISOString(),
            expRTDate: new Date(rtPayload.exp * 1000).toISOString(),
        });

        return {
            status: Statuses.Success,
            data: {
                accessToken,
                refreshToken
            },
            extensions: [],
        };
    },

    registrationUser: async (userDto: TUserDTO): Promise<Result<WithId<TUser> | null>> => {
        const existingUser = await usersQueryRepository.findByLoginOrEmail(userDto.email);

        if(existingUser !== null) {
            return {
                status: Statuses.BadRequest,
                data: null,
                errorMessage: 'Bad request',
                extensions: [{ field: 'email', message: 'User already exist' }],
            };
        }

        const { user: newUser } = await usersService.createUser(userDto);

        if(!newUser) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'User was not created',
                extensions: [{ field: 'email', message: 'User was not created' }],
            };
        }

        sendEmail(newUser);

        return {
            status: Statuses.Success,
            data: newUser,
            extensions: [],
        };
    },
    
    registrationConfirmationUser: async (confirmationCode: string): Promise<Result<WithId<TUser> | null>> => {
        const { user: userByCode } = await usersQueryRepository.findUserByConfirmationCode(confirmationCode);

        if(!userByCode) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found User',
                extensions: [{ field: 'code', message: 'Not found user by this confirmation code' }],
            };
        }

        if(userByCode.emailConfirmation.isConfirmed === true) {
            return {
                status: Statuses.BadRequest,
                data: null,
                errorMessage: 'already been applied',
                extensions: [{ field: 'code', message: 'this code already been applied' }],
            };
        }

        if(userByCode.emailConfirmation.expirationDate < new Date()) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Confirmation code expired',
                extensions: [{ field: 'expirationDate', message: 'Confirmation code expired' }],
            };
        }

        const { user: confirmedUser } = await usersRepository.confirmUserByConfirmationCode(confirmationCode);

        return {
            status: Statuses.Success,
            data: confirmedUser,
            extensions: [],
        };
    },

    registrationEmailResending: async (email: string): Promise<Result<WithId<TUser> | null>> => {
        const existingUser = await usersQueryRepository.findByLoginOrEmail(email);

        if(!existingUser) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not found',
                extensions: [{ field: 'email', message: 'Not found user' }],
            };
        }

        if(existingUser.emailConfirmation.isConfirmed === true) {
            return {
                status: Statuses.BadRequest,
                data: null,
                errorMessage: 'User already Confermed',
                extensions: [{ field: 'email', message: 'User already Confermed' }],
            };
        }

        const { user: updatedUser } = await usersRepository.updateConfirmationCode(existingUser._id);

        if(!updatedUser) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'User was not updated',
                extensions: [{ field: 'id', message: 'User was not updated' }],
            };
        }

        sendEmail(updatedUser);

        return {
            status: Statuses.Success,
            data: updatedUser,
            extensions: [],
        };
    },

    refreshTokens: async (userId: string, oldRefreshToken: string): Promise<Result<{ accessToken: string, refreshToken: string } | null>> => {
        const { user } = await usersQueryRepository.getUserById(userId);

        if(!user) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'userId', message: 'User not found' }],
            };
        }

        const oldPayload = jwtService.decodePayloadToken<{ deviceId: string }>(oldRefreshToken);

        const device = await devicesQueryRepository.getDeviceByParams({
            deviceId: oldPayload.deviceId,
            userId,
        });

        if(!device) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'deviceId', message: 'Device not found for this user' }],
            };
        }

        const { accessToken } = jwtService.createAccessToken(user);
        const { refreshToken } = jwtService.createRefreshToken(user._id.toString(), device.deviceId);

        const newRTPayload = jwtService.decodePayloadToken<{exp: number, iat: number }>(refreshToken);

        const deviceForUpdate = {
            ...device,
            lastActiveDate: new Date(newRTPayload.iat * 1000).toISOString(),
            expRTDate: new Date(newRTPayload.exp * 1000).toISOString()
        }

        await devicesRepository.updateDevice(deviceForUpdate);

        return {
            status: Statuses.Success,
            data: {
                accessToken,
                refreshToken
            },
            extensions: [],
        };
    },
}

function sendEmail (user: WithId<TUser>) {
    // тут хардкод, который на фронт отправляет рандомную ссылку с кодом подтверждения
    // и затем фронт еще один пост запрос делает для вызова логики подтверждения 
    const subject = 'Registration confirm';
    const message = `
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${SETTINGS.PATH.BASE_URL}${SETTINGS.PATH.AUTH}/registration-confirmation?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>
    `;

    nodemailerService
        .sendEmail(user.email, subject, message)
        .catch((error: unknown) => console.error('error in send email:', error));
}
