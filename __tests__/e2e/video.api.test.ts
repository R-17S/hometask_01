import request from 'supertest'
import {app, Video} from "../../src";


describe('/videos', () => {
    let newVideo: Video | null = null;
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204);
    });

    it('GET should return 200 and []', async () => {
        await request(app).get('/videos').expect(200,[]);
    });

    it('- POST does not create the video with incorrect data (no title, no author)', async () => {
        await request(app)
            .post('/videos')
            .send({ title: '', author: '' })
            .expect(400, {
                errorsMessages: [
                    { message: 'Title is required and should be less than 40 characters', field: 'title' },
                    { message: 'Author is required and should be less than 20 characters', field: 'author' },
                    { message: 'At least one resolution should be added', field: 'availableResolutions' }
                ],
            });
        const res = await request(app).get('/videos');
        expect(res.body).toEqual([]);

    });

    it('+ POST create the video with correct data', async () => {
        const res = await request(app)
            .post('/videos')
            .send({ title: 'New Video', author: 'Author', availableResolutions: ['P2160'] })
            .expect(201);

        newVideo = res.body;
        expect(newVideo).toEqual({
            id: expect.any(Number),
            title: 'New Video',
            author: 'Author',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P2160'],
        });
        const res1 = await request(app).get('/videos');
        expect(res1.body).toEqual([res.body]);
    });

    it('- GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/11').expect(404);
    });

    it('+ GET video by ID with correct id', async () => {
        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(200, newVideo);
    });

    it('- PUT video by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/12')
            .send({ title: 'title', author: 'title' })
            .expect(404, { message: 'Video not found' });

        const res = await request(app).get('/videos');
        expect(res.body[0]).toEqual(newVideo);
    });

    it('+ PUT video by ID with correct data', async () => {
      await request(app)
            .put('/videos/' + newVideo!.id)
            .send({
                title: 'Updated Title',
                author: 'Updated Author',
                canBeDownloaded: false,
                minAgeRestriction: null,
                publicationDate: '2023-01-12T08:12:39.261Z',
                availableResolutions: ['P144', 'P720']
            })
          //console.log(res1.body)
          .expect(204);

        const res = await request(app).get('/videos');
        expect(res.body[0]).toEqual({
            ...newVideo,
            title: 'Updated Title',
            author: 'Updated Author',
            publicationDate: '2023-01-12T08:12:39.261Z',
            availableResolutions: ['P144', 'P720'],
            canBeDownloaded: false,
            minAgeRestriction: null,
        });
        newVideo = res.body[0];
    });

    it('- DELETE video by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876')
            .expect(404);

        const res = await request(app).get('/videos');
        expect(res.body[0]).toEqual(newVideo);
    });

    it('+ DELETE video by correct ID', async () => {
        await request(app)
            .delete('/videos/' + newVideo!.id)
            .expect(204);

        const res = await request(app).get('/videos');
        expect(res.body.length).toBe(0);
    });
});
