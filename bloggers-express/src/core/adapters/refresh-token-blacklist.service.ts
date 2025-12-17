import { blacklistTokensRepository } from '../../modules/auth/repositories/blacklist-tokens.repository';

export const refreshTokenBlacklistService = {
    async invalidateToken(token: string): Promise<void> {
        await blacklistTokensRepository.addToken(token);
    },

    async isTokenInvalidated(token: string): Promise<boolean> {
        return await blacklistTokensRepository.isTokenBlacklisted(token);
    },

    async clearExpiredTokens(): Promise<void> {
        await blacklistTokensRepository.deleteExpiredTokens();
    },
};

