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
    email: 'preciousolanrewajuw@gmail.com',
    password: '123456'
};

describe('Url Endpoints', () => {
    
    beforeAll(async () => {
        await connectDB();
    });

    let newToken;
    let newUrlId;
    beforeAll(async () => { 
        //register user and login user
        await request(app)
            .post('/auth/register')
            .send(userOne);
        const user = await request(app)
            .post('/auth/login')
            .send({
                email: userOne.email,
                password: userOne.password
            });
        newToken = user.body.token;
    });

    afterAll(async () => { 
        await UserModel.deleteMany();
        await UrlModel.deleteMany();
        await ClicksModel.deleteMany();
    });

    it('should create a new url', async () => { 
        const res = await request(app)
            .post('/urls')
            .set('cookie', [`token=${newToken}`])
            .send(urlOne)
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('newUrl');
        newUrlId = res.body.newUrl._id;
    });

    it('should get all urls', async () => { 
        const res = await request(app)
            .get('/url/user')
            .set('cookie', [`token=${newToken}`])
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('urls');
    });

    it('update a url', async () => {   
        const res = await request(app)
            .put(`/urls/${newUrlId}`)
            .set('cookie', [`token=${newToken}`])
            .send({
                url: 'https://www.facebook.com',
                slug: 'facebook'
            })
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('newUrl');
    });

    it('should delete a url', async () => { 
        //create url
        const url = await request(app)
            .post('/urls')
            .set('cookie', [`token=${newToken}`])
            .send({
                url: 'https://www.instagram.com',
                slug: 'instagram'
            });
        
        //delete url
        const res = await request(app)
            .delete(`/urls/${url.body.newUrl._id}`)
            .set('cookie', [`token=${newToken}`])
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('message');
    });
});