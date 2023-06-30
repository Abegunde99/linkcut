const app = require('../app');
const request = require('supertest');
const { connectDB } = require('../config/connection');
const { ClicksModel, UrlModel, UserModel } = require('../models');

const urlOne = {
    url: 'https://www.google.com',
    slug: 'google',
};

const userOne = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnDoe@gmail.com',
    password: '123456'
};

beforeAll(async () => {
    await connectDB();

    //register user and login user
    const user = await UserModel.create(userOne);
    const res = await request(app)
    .post('/auth/login')
    .send({
        email: userOne.email,
        password: userOne.password
    });
});

afterAll(async () => { 
    await UserModel.deleteMany();
    await UrlModel.deleteMany();
    await ClicksModel.deleteMany();
});


describe('Clicks Endpoints', () => { 
    it('should get all clicks', async () => {
        const res = await request(app)
            .get('/clicks')
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });
    
    it('should get clicks by urlId', async () => { 
        const url = await UrlModel.create(urlOne);
        const res = await request(app)
            .get(`/clicks/${url._id}`)
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('should not get clicks by urlId with invalid urlId', async () => { 
        const res = await request(app)
            .get(`/clicks/123456`)
            .expect(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should get clicks by urlCode', async () => { 
        const url = await UrlModel.create({
            url: 'https://www.github.com',
            slug: 'github'
        });
        const res = await request(app)
            .get(`/${url.slug}`)
            .expect(200);
        expect(res.body).toHaveProperty('success');
    });
});