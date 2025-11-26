import jwt from 'jsonwebtoken';
import { WithId } from 'mongodb';
import { TUser } from '../../modules/users/types/user';
import { SETTINGS } from '../settings/settings';

export const jwtService = {
    createToken: (user: WithId<TUser>): { accessToken: string } => {
        const payload = {
            email: user.email,
            login: user.login,
            userId: user._id,
        }

        const accessToken = jwt.sign(
            payload, 
            SETTINGS.SECRET_KEY,
            {
                expiresIn: '24h'
            }
        );

        return {
            accessToken
        }
    },

    verifyToken: (token: string): { userId: string} | null => {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string};
        } catch(error: unknown) {
            return null;
        }
    }
}