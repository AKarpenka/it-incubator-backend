import argon2 from 'argon2';

export const argon2Service = {
    async generateHash(password: string) {
        return await argon2.hash(password);
    },

    async checkPassword(password: string, hash: string) {
        return await argon2.verify(hash, password);
    }
}