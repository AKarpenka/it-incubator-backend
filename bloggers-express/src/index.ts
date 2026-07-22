import 'reflect-metadata';
import express from 'express';
import { runDB } from './db/db';
import { SETTINGS } from './core/settings/settings';
import { setupApp } from './setup-app';

const bootstrap = async () => {
    const app = express();
    
    setupApp(app);

    await runDB();

    app.set('trust proxy', true);

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT);
    });
    
    return app;
}

bootstrap();
