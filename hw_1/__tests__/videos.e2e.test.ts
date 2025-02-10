import 'jest';
import {req} from './test-helpers';
import {setDB} from '../src/db';
import {dataSetMock, newVideoWithIdMock} from './datasets';
import {SETTINGS} from '../src/settings';
import { TVideoDB } from '../src/videos/types';
import { Resolutions } from '../src/videos/constants';
import { getNextDayInISOString } from '../src/videos/helpers';

describe('/videos', () => {
    beforeAll(async () => { 
        setDB();
    });

    it('getVideos: should get empty array from DB', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200);

        expect(res.body.length).toBe(0);
    });

    it('getVideos: should get NOT empty array', async () => {
        setDB(dataSetMock); 

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200);

        expect(res.body.length).toBe(1);
        expect(res.body[0]).toEqual(dataSetMock.videos[0]);
    });

    it('getVideoById: should get video by id', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(200);

        expect(res.body).toEqual(dataSetMock.videos[0]);
    });

    it('getVideoById: should NOT get video by id', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/444')
            .expect(404)
    });

    it('createVideos: should create video', async () => {
        setDB();

        const newVideo: TVideoDB = {
            title: 't',
            author: 'a',
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(201)

        expect(res.body.title).toEqual(newVideo.title)
    });

    it('createVideos: validation availableResolutions fail', async () => {
        const newVideo: TVideoDB = {
            title: 't',
            author: 'a',
        };

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: availableResolutions is required', 
                    field: 'availableResolutions'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('createVideos: validation minAgeRestriction fail', async () => {
        const newVideo: TVideoDB = {
            title: 't',
            author: 'a',
            minAgeRestriction: 33,
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: should be 1 < minAgeRestriction > 18', 
                    field: 'minAgeRestriction'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('createVideos: validation minAgeRestriction fail', async () => {
        const newVideo: any = {
            title: 't',
            author: 'a',
            canBeDownloaded: 'qqqq',
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'canBeDownloaded should be boolean', 
                    field: 'canBeDownloaded'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('createVideos: validation of title and author failed', async () => {
        const newVideo: any = {
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: author is required', 
                    field: 'author'
                },
                {
                    message: 'error: title is required', 
                    field: 'title'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: should update video', async () => {
        setDB();
        setDB(dataSetMock);

        const newVideo: TVideoDB = {
            id: 1,
            title: 't1111',
            author: 'a',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: getNextDayInISOString(new Date().toISOString()),
            availableResolutions: [Resolutions.P240],
        }

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(204)

        const getRes = await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(200);

        expect(getRes.body.title).toEqual(newVideo.title);
    });

    it('updateVideoById: validation availableResolutions fail', async () => {
        const newVideo: TVideoDB = {
            title: 't',
            author: 'a',
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: availableResolutions is required', 
                    field: 'availableResolutions'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: validation minAgeRestriction fail', async () => {
        const newVideo: TVideoDB = {
            title: 't',
            author: 'a',
            minAgeRestriction: 33,
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: should be 1 < minAgeRestriction > 18', 
                    field: 'minAgeRestriction'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: validation of title and author failed', async () => {
        const newVideo: any = {
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: author is required', 
                    field: 'author'
                },
                {
                    message: 'error: title is required', 
                    field: 'title'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: validation of maxLenth title failed', async () => {
        const newVideo: any = {
            availableResolutions: [Resolutions.P240],
            title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            author: 'a',
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: maxLength: 40', 
                    field: 'title'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: validation of maxLenth author failed', async () => {
        const newVideo: any = {
            availableResolutions: [Resolutions.P240],
            title: 'a',
            author: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'error: maxLength: 20', 
                    field: 'author'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: validation canBeDownloaded fail', async () => {
        const newVideo: any = {
            title: 't',
            author: 'a',
            canBeDownloaded: 'qqq',
            availableResolutions: [Resolutions.P240],
        };

        const res = await req
            .put(SETTINGS.PATH.VIDEOS +'/1')
            .send(newVideo)
            .expect(400)

        const errorsMessages = {
            errorsMessages: [
                {
                    message: 'canBeDownloaded should be boolean', 
                    field: 'canBeDownloaded'
                }
            ]
        };
        
        expect(res.body).toEqual(errorsMessages);
    });

    it('updateVideoById: should NOT get video by id', async () => {
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + '/444')
            .expect(404)
    });

    it('deleteVideoById: should delete video by id', async () => {
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS + '/1')
            .expect(204);

        const getRes = await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(404);
    });

    it('deleteVideoById: should delete video by id', async () => {
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS + '/4444')
            .expect(404);
    });
})