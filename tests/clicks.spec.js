const app = require('../app');
const request = require('supertest');
const { connectDB } = require('../config/connection');
const { ClicksModel, UrlModel, UserModel } = require('../models');

const urlOne = {
    url: 'https://www.github.com',
    slug: 'github',
};

const userOne = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnDoe@gmail.com',
    password: '123456'
};

// afterEach(async () => { 
//     await UserModel.deleteMany();
//     await UrlModel.deleteMany();
//     await ClicksModel.deleteMany();
// });

describe('Clicks Endpoints', () => { 
    
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => { 
        await UserModel.deleteMany();
        await UrlModel.deleteMany();
        await ClicksModel.deleteMany();
    });

    let newToken;
    let newUrlId;
    let urlCode;
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

        //create a new url
        const res = await request(app)
            .post('/urls')
            .set('cookie', [`token=${newToken}`])
            .send(urlOne)
        
        newUrlId = res.body.newUrl._id;
        urlCode = res.body.newUrl.slug;
    });

    it('should get all clicks', async () => {
        const res = await request(app)
            .get('/clicks')
            .set('cookie', [`token=${newToken}`])
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });
    
    it('should get clicks by urlId', async () => { 
       
        const res = await request(app)
            .get(`/clicks/${newUrlId}`)
            .set('cookie', [`token=${newToken}`])
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('should not get clicks by urlId with invalid urlId', async () => { 
       
        const res = await request(app)
            .get(`/clicks/123456`)
            .set('cookie', [`token=${newToken}`])
            .expect(404);
        expect(res.body).toHaveProperty('error');
    });

    it('should get clicks by urlCode', async () => { 
        const res = await request(app)
            .get(`/${urlCode}`)
            .set('cookie', [`token=${newToken}`])
            .expect(302);
    });
});