import TUserId from './userId';

declare global {
    declare namespace Express {
        export interface Request {
            user: TUserId | undefined;
        }
    }
}
