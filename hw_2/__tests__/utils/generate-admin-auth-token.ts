import { SETTINGS } from '../../src/core/settings/settings';
import { fromUTF8ToBase64 } from '../../src/middlewares/auth/basic-auth-middleware';

export function generateAdminAuthToken(): string {
  const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);
  
  return `Basic ${codedAuth}`;
}

