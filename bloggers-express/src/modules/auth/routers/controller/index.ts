import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from '@shared/userId';
import { UsersQueryRepository } from '../../../users/repositories/users.query-repository';
import { mapToCurrentUserViewModel } from '../mappers/map-to-current-user-view-model.utils';
import { AuthService } from '../../application/auth.service';
import { Statuses } from '../../../../core/types/resultStasuses';
import { JwtService } from '../../../../core/adapters/jwt.service';
import { DevicesService } from '../../../devices/application/devices.service';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) protected authService: AuthService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(DevicesService) protected devicesService: DevicesService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    ) {}

    async getCurrentUserHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
        try {
            const user: TUserId | undefined = req.user;

            if(!user) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
            
                return;
            }

            const userById = await this.usersQueryRepository.getUserById(user.id.toString());

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

    async loginHandler(req: Request, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;
    
            const result = await this.authService.loginUser({
                loginOrEmail, 
                password, 
                deviceName: req.get('user-agent') ?? 'unknown',
                ip: req.ip ?? 'unknown'
            });
    
            if (result.status !== Statuses.Success) {
                res
                    .status(HttpStatus.Unauthorized)
                    .send(result.extensions);
                    
                return;
            }
    
            res.cookie('refreshToken', result.data?.refreshToken, {
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict',
                maxAge: 20000
            });
    
            res
                .status(HttpStatus.Ok)
                .send({ accessToken: result.data?.accessToken });
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async logoutHandler(req: Request, res: Response) {
        try {
            const user = req.user;
    
            if(!user) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
            
                return;
            }
    
            if (req.refreshToken) {
                const currentRT = this.jwtService.decodePayloadToken<{deviceId: string}>(req.refreshToken);
                await this.devicesService.deleteDeviceByDeviceId(user.id.toString(), currentRT.deviceId);
            }
    
            res.clearCookie('refreshToken');
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async refreshTokenHandler(req: Request, res: Response) {
        try {
            if (!req.user || !req.refreshToken) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
                
                return;
            }

            const result = await this.authService.refreshTokens(req.user.id.toString(), req.refreshToken);

            if (result.status !== Statuses.Success) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
                    
                return;
            }

            res.cookie('refreshToken', result.data?.refreshToken, {
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict',
                maxAge: 20000
            });

            res
                .status(HttpStatus.Ok)
                .json({ accessToken: result.data?.accessToken });
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async registartionHandler(req: Request, res: Response) {
        try {
            const result = await this.authService.registrationUser(req.body);
    
            if (result.status !== Statuses.Success) {
                console.error('Error:', result);
            }
    
            res.sendStatus(HttpStatus.NoContent);
    
            return;
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async registrationConfirmationHandler(req: Request, res: Response) {
        try {
            const result = await this.authService.registrationConfirmationUser(req.body.code);
    
            if (result.status !== Statuses.Success) {
                console.error('Error:', result);
    
                res
                    .status(HttpStatus.BadRequest)
                    .json({ errorsMessages: result.extensions });
    
                return;
            }
    
            res.sendStatus(HttpStatus.NoContent);
    
            return;
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async registrationEmailResendingHandler(req: Request, res: Response) {
        try {
            const result = await this.authService.registrationEmailResending(req.body.email);
    
            if (result.status !== Statuses.Success) {
                console.error('Error:', result);
    
                res
                    .status(HttpStatus.BadRequest)
                    .json({ errorsMessages: result.extensions });
    
                return;
            }
    
            res.sendStatus(HttpStatus.NoContent);
    
            return;
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async passwordRecoveryHandler(req: Request, res: Response) {
        try {
            const result = await this.authService.passwordRecovery(req.body.email);

            if (result.status !== Statuses.Success) {
                console.error('Error:', result);
    
                res
                    .status(HttpStatus.BadRequest)
                    .json({ errorsMessages: result.extensions });
    
                return;
            }
    
            res.sendStatus(HttpStatus.NoContent);
    
            return;
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async newPasswordHandler(req: Request, res: Response) {
        try {
            const { newPassword, recoveryCode } = req.body;

            const result = await this.authService.updateUserPassword(newPassword, recoveryCode);

            if (result.status !== Statuses.Success) {
                console.error('Error:', result);
    
                res
                    .status(HttpStatus.BadRequest)
                    .json({ errorsMessages: result.extensions });
    
                return;
            }
    
            res.sendStatus(HttpStatus.NoContent);
    
            return;
                
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }
}