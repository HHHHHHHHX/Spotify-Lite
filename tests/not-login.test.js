const supertest = require('supertest');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const app = require('../app');
const api = supertest(app);
// const api = supertest('http://localhost:3000');

jest.setTimeout(10 * 60 * 1000);

const noExistMockUser = {
  email: `nonuser@test.com`,
  password: `1234`,
};

beforeAll(async () => {
  await mongoose.connect(
    'mongodb+srv://dbUser:never123@cluster0.xmuoy7j.mongodb.net/spotify?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Not logged in', () => {
  test('should return status code 302', async () => {
    const res = await api.get('/');
    expect(res.statusCode).toBe(302);
  });

  test('should Login failed', async () => {
    const res1 = await api
      .post('/user/login')
      .set('Content-type', 'application/json')
      .send({
        email: noExistMockUser.email,
        password: noExistMockUser.password,
      });
    expect(res1.body.message.includes('Invalid email or password')).toBe(true);

    const res2 = await api
      .post('/user/login')
      .set('Content-type', 'application/json')
      .send({
        email: '1',
        password: noExistMockUser.password,
      });
    expect(res2.body.message.includes('Incorrect email format')).toBe(true);

    const res3 = await api
      .post('/user/login')
      .set('Content-type', 'application/json')
      .send({
        email: noExistMockUser.email,
        password: '1',
      });
    expect(
      res3.body.message.includes(
        'The length of the password is between 3-30 characters'
      )
    ).toBe(true);
  });

  test('should redirect when carrying an incorrect token', async () => {
    const res = await api
      .get('/user/songs')
      .set('Cookie', [`token=errorToken`]);
    expect(res.headers.location).toMatch('/user/login');
  });

  test('should return 302 when not carrying tokens', async () => {
    const res = await api.get('/user/songs');
    expect(res.statusCode).toBe(302);
  });

  test('should render EJS template pages correctly', async () => {
    const res1 = await api.get('/user/signup');
    expect(res1.statusCode).toBe(200);
    expect(res1.text.includes('Sign up')).toBe(true);

    const res2 = await api.get('/user/login');
    expect(res2.statusCode).toBe(200);
    expect(res2.text.includes('Login')).toBe(true);
  });
});
