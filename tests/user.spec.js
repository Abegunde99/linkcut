const app = require('../app');
const request = require('supertest');
const { connectDB } = require('../config/connection');
const { UserModel } = require('../models');

const userOne = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'preciousolanrewaju1995@gmail.com',
    password: '123456'
};

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => { 
    await UserModel.deleteMany();
});

describe('User Endpoints', () => { 
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userOne)
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userOne.email,
                password: 'wrongpassword'
            })
            .expect(401);
        expect(res.body).toHaveProperty('error');
    });

    it('should logout a user', async () => { 
        const res = await request(app)
            .get('/api/v1/auth/logout')
            .expect(200);
        expect(res.body).toHaveProperty('success');
    });

    it('should update a user', async () => { 
        const user = new UserModel({
            firstName: 'Precious',
            lastName: 'Olanrewaju',
            email: 'preciousolanrewaju1998@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await request(app)
            .put(`/api/v1/users/${user._id}`)
            .send({
                firstName: 'joshua',
                lastName: 'Olanrewaju',
                email: 'preciousolanrewaju1998@gmail.com'
            })
            .expect(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('data');
    });

    it('should delete a user', async () => { 
        const user = new UserModel({
            firstName: 'Precious',
            lastName: 'Olanrewaju',
            email: 'preciousolanrewaju1996@gmail.com',
            password: '123456'
        });
        await user.save();
        const res = await request(app)
            .delete(`/api/v1/users/${user._id}`)
            .expect(200);
        expect(res.body).toHaveProperty('success');
    });
});
