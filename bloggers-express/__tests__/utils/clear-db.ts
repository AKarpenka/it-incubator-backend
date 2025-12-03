import request from 'supertest';
import { Express } from 'express';
import { SETTINGS } from '../../src/core/settings/settings';
import { HttpStatus } from '../../src/core/types/httpStatuses';

export async function clearDb(app: Express) {
  await request(app)
    .delete(`${SETTINGS.PATH.TESTING}/all-data`)
    .expect(HttpStatus.NoContent);
  return;
}


