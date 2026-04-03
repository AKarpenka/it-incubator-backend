import jwt from 'jsonwebtoken';
import { WithId } from 'mongodb';
import { TUser } from '../../modules/users/types/user';
import { SETTINGS } from '../settings/settings';

export const jwtService = {
    createAccessToken: (user: WithId<TUser>): { accessToken: string } => {
        const payload = {
            email: user.email,
            login: user.login,
            userId: user._id,
        }

        const accessToken = jwt.sign(
            payload, 
            SETTINGS.SECRET_KEY,
            {
                expiresIn: '10s' //todo вынести бы это в env
            }
        );

        return {
            accessToken
        }
    },

    verifyToken: (token: string): { userId: string, deviceId: string} | null => {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string, deviceId: string};
        } catch(error: unknown) {
            return null;
        }
    },

    createRefreshToken: (userId: string, deviceId: string): { refreshToken: string } => {
        const payload = {
            userId,
            deviceId,
        };
        
        const refreshToken = jwt.sign(
            payload, 
            SETTINGS.SECRET_KEY,
            {
                expiresIn: '20s' //todo вынести бы это в env 
            }
        );

        return { refreshToken };
    },

    decodePayloadToken: <T>(token: string): T => {
        return jwt.decode(token) as T;
    }
}