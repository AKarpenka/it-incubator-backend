import 'jest';
import {req} from './test-helpers';
import {SETTINGS} from '../src/settings';
import { TBlog, TDataBase, TPost } from '../src/types/TDataBase';
import { db } from '../src/db/db';
import { dataset1 } from './mocks';
import { createString, setDB } from './helpers';
import { fromUTF8ToBase64 } from '../src/middlewares/auth/basic-auth-middleware';

const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

type TBlogInputModel = Pick<TBlog, 'description' | 'name' | 'websiteUrl'>;

describe('/blogs', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB();
    });

    it('createBlog: should create', async () => {
        setDB();

        const newBlog: TBlogInputModel = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog)
            .expect(201);

        expect(res.body.name).toEqual(newBlog.name);
        expect(res.body.description).toEqual(newBlog.description);
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);
        expect(typeof res.body.id).toEqual('string');

        expect(res.body).toEqual(db.blogs[0]);
    });

    it('createBlog: shouldn\'t create 401', async () => {
        setDB();

        const newBlog: TBlogInputModel = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(401);

        expect(db.blogs.length).toEqual(0);
    });

    it('createBlog: shouldn\'t create', async () => {
        setDB();
        
        const newBlog: TBlogInputModel = {
            name: createString(17),
            description: createString(505),
            websiteUrl: createString(10001),
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(3);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');

        expect(db.blogs.length).toEqual(0);
    });

    it('getBlogs: should get empty array', async () => {
        setDB();

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200);

        expect(res.body.length).toEqual(0);
    });
    
    it('getBlogs: should get not empty array', async () => {
        setDB(dataset1);

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200);

        expect(res.body.length).toEqual(1);
        expect(res.body[0]).toEqual(dataset1.blogs[0]);
    });

    it('getBlog: shouldn\'t find', async () => {
        setDB(dataset1);

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(404);
    });

    it('getBlog: should find', async () => {
        setDB(dataset1);

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .expect(200);

        expect(res.body).toEqual(dataset1.blogs[0]);
    });

    it('deleteBlog: should del', async () => {
        setDB(dataset1);

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204);

        expect(db.blogs.length).toEqual(0);
    });

    it('deleteBlog: shouldn\'t del', async () => {
        setDB();

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404);
    });

    it('deleteBlog: shouldn\'t del 401', async () => {
        setDB();

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic' + codedAuth})
            .expect(401);
    });

    it('updateBlog: should update', async () => {
        setDB(dataset1)
        const blog: TBlogInputModel = {
            name: "n2",
            description: "description-2",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(204);

        expect(db.blogs[0]).toEqual({...db.blogs[0], ...blog});
    });

    it('updateBlog: shouldn\'t update 404', async () => {
        setDB()
        const blog: TBlogInputModel = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(404);
    });

    it('updateBlog: shouldn\'t update2', async () => {
        setDB(dataset1);

        const blog: TBlogInputModel = {
            name: '',
            description: '',
            websiteUrl: '',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(400)

        expect(db).toEqual(dataset1);
        expect(res.body.errorsMessages.length).toEqual(3);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');
    });

    it('updateBlog: shouldn\'t update 401', async () => {
        setDB(dataset1);

        const blog: TBlogInputModel = {
            name: "n1",
            description: "description-1",
            websiteUrl: "https://_XzVrOodmeJpO4JfbvLnKnQQekHQyldl5_PV9pZ4BCjIIziOgnj0GFc4pGGPZxiEugUOH.t7bJbiTBnbh020tkB8I8AQ",
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(blog)
            .expect(401);

        expect(db).toEqual(dataset1);
    })
});
