const supertest = require('supertest');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const app = require('../app');
const { extractCookies } = require('./extract-cookies');

const api = supertest(app);
// const api = supertest('http://localhost:3000');

jest.setTimeout(10 * 60 * 1000);

const mockUser = {
  email: `mock${uuid()}@test.com`,
  username: `mockusrname`,
  password: `1234`,
};

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

describe('Loggin', () => {
  let cookies = [];

  test('should register successfully', async () => {
    const res0 = await api
      .post('/user/signup')
      .set('Content-type', 'application/json')
      .send({
        email: mockUser.email,
        password: mockUser.password,
        username: '12',
      });
    expect(
      res0.body.message.includes(
        'The length of the username is between 3-30 characters'
      )
    ).toBe(true);

    const res1 = await api
      .post('/user/signup')
      .set('Content-type', 'application/json')
      .send({
        email: '123',
        password: mockUser.password,
        username: '123',
      });
    expect(res1.body.message.includes('Incorrect email format')).toBe(true);

    const res2 = await api
      .post('/user/signup')
      .set('Content-type', 'application/json')
      .send({
        email: '123@qq.com',
        password: '12',
        username: '123',
      });
    expect(
      res2.body.message.includes(
        'The length of the password is between 3-30 characters'
      )
    ).toBe(true);

    const res3 = await api
      .post('/user/signup')
      .set('Content-type', 'application/json')
      .send({
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      });
    cookies = extractCookies(res3.headers);
    expect(res3.body.success).toBe(true);

    // again
    const res4 = await api
      .post('/user/signup')
      .set('Content-type', 'application/json')
      .send({
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      });
    expect(res4.body.message.includes('User already exists')).toBe(true);

    const res5 = await api
      .post('/user/login')
      .set('Content-type', 'application/json')
      .send({
        email: mockUser.email,
        password: 'errorPassword',
      });
    expect(res5.statusCode).toBe(400);
  });

  test('should render EJS template pages correctly', async () => {
    const res1 = await api
      .get('/user/profile')
      .set('Cookie', [`token=${cookies['token'].value}`]);
    expect(res1.statusCode).toBe(200);
    expect(res1.text.includes('Your Profile')).toBe(true);

    const res2 = await api
      .get('/user/home')
      .set('Cookie', [`token=${cookies['token'].value}`]);
    expect(res2.statusCode).toBe(200);
    expect(res2.text.includes('Your Liked Songs')).toBe(true);
    expect(res2.text.includes('Your Liked Artists')).toBe(true);
  });

  test('should return empty liked songs and empty followed artists', async () => {
    const res1 = await api
      .get('/user/songs')
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res1.body.success).toBe(true);
    expect(res1.body.data.length).toBe(0);

    const res2 = await api
      .get('/user/artists')
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res2.body.success).toBe(true);
    expect(res2.body.data.length).toBe(0);
  });

  test('should update user info correctly', async () => {
    const res = await api
      .put('/user/info')
      .send({
        username: '1',
        password: mockUser.password,
        email: mockUser.email,
      })
      .set('Cookie', [`token=${cookies['token'].value}`]);
    expect(
      res.body.message.includes(
        'The length of the username is between 3-30 characters'
      )
    ).toBe(true);

    const res1 = await api
      .put('/user/info')
      .send({
        username: mockUser.username,
        password: '1',
        email: mockUser.email,
      })
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(
      res1.body.message.includes(
        'The length of the password is between 3-30 characters'
      )
    ).toBe(true);

    const res2 = await api
      .put('/user/info')
      .send({
        username: mockUser.username,
        password: mockUser.password,
        email: 'non email',
      })
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res2.body.message.includes('Incorrect email format')).toBe(true);

    const res3 = await api
      .put('/user/info')
      .send({
        username: mockUser.username,
        password: mockUser.password,
        email: mockUser.email,
      })
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res3.statusCode).toBe(200);
  });

  test('should get user info  correctly', async () => {
    const res = await api
      .get('/user')
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe(mockUser.username);
  });

  test('should update corretly', async () => {
    const res = await api
      .put('/user/songs/like')
      .send({ songId: '609c28f0d2a6e2a1b8e6f7a4', unlike: 'YES' })
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res.statusCode).toBe(200);
  });

  test('should update corretly', async () => {
    const res = await api
      .put('/user/artists/follow')
      .send({ follow: 'Test Artists', unlike: 'YES' })
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res.statusCode).toBe(200);
  });

  test('should search songs corretly', async () => {
    const res1 = await api
      .get('/songs?search=Adele&language=English&genre=Pop')
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res1.text.includes('Adele')).toBe(true);
    expect(res1.text.includes('English')).toBe(true);
    expect(res1.text.includes('Pop')).toBe(true);
  });

  test('should logout corretly', async () => {
    const res1 = await api
      .post('/user/logout')
      .set('Cookie', [`token=${cookies['token'].value}`]);

    expect(res1.body.success).toBe(true);
    expect(res1.body.message).toBe('Logout successful');
  });
});
