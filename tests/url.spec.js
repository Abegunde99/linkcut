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


describe('Url Endpoints', () => {
    it('should create a new url', async () => { 
        const res = await request(app)
            .post('/urls')
            .send(urlOne)
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('should get all urls', async () => { 
        const res = await request(app)
            .get('/urls')
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('update a url', async () => { 
        const url = await UrlModel.create({
            url: 'https://www.github.com',
            slug: 'github'
        });
        const res = await request(app)
            .put(`/urls/${url._id}`)
            .send({
                url: 'https://www.facebook.com',
                slug: 'facebook'
            })
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('should delete a url', async () => { 
        const url = await UrlModel.create({
            url: 'https://www.github.com',
            slug: 'github'
        });
        const res = await request(app)
            .delete(`/urls/${url._id}`)
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });
});