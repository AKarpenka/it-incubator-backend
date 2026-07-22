import argon2 from 'argon2';
import { injectable } from 'inversify';

@injectable()
export class Argon2Service {
    async generateHash(password: string) {
        return await argon2.hash(password);
    }

    async checkPassword(password: string, hash: string) {
        return await argon2.verify(hash, password);
    }
}
