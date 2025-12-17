import { blacklistTokensCollection } from "../../../db/db";

export const blacklistTokensRepository = {
    addToken: async (token: string): Promise<void> => {
        await blacklistTokensCollection.insertOne({
            token,
            createdAt: new Date(),
        });
    },

    isTokenBlacklisted: async (token: string): Promise<boolean> => {
        const blacklistedToken = await blacklistTokensCollection.findOne({ token });
        
        return blacklistedToken !== null;
    },

    deleteExpiredTokens: async (): Promise<void> => {
        // Удаляем токены старше 20 секунд (время жизни refresh token)
        const expirationDate = new Date(Date.now() - 20000);

        await blacklistTokensCollection.deleteMany({
            createdAt: { $lt: expirationDate }
        });
    },
}

