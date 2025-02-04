import express, { Request, Response } from 'express';
import cors from 'cors';

const port = 3000;
 
export const app = express(); // создать приложение
// app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
// app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк
 
// app.get('/', (req, res) => {
//     // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
//     res.status(200).json({version: '1.0'})
// });
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)

app.get('/', (req: Request, res: Response) => {
    const message = 'Hello from Incubator';
    
    res.send(message);
})
 
app.listen(port, () => {
    console.log('...server started in port ' + port)
});