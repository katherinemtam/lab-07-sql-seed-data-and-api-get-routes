import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/dogs', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    const expectedDogs = [
      {
        name: 'Beethoven',
        type: 'St Bernard',
        url: '/dogs/beethoven.jpg',
        media: 'Beethoven',
        year: 1992,
        isAnimated: false
      },
      {
        name: 'Benji',
        type: 'Mutt',
        url: '/dogs/benji.jpg',
        media: 'Benji',
        year: 1974,
        isAnimated: false
      },
      {
        name: 'Rin Tin Tin',
        type: 'German Shepherd',
        url: '/dogs/rin - tin - tin.png',
        media: 'The Adventures of Rin Tin Tin',
        year: 1954,
        isAnimated: false
      },
      {
        name: 'Hachiko',
        type: 'Akita',
        url: '/dogs/hachiko.jpg',
        media: 'Hachi: A Dog\'s Tale',
        year: 2009,
        isAnimated: false
      }
    ];

    let hachiko = {
      name: 'Hachiko',
      type: 'Akita',
      url: '/dogs/hachiko.jpg',
      media: 'Hachi: A Dog\'s Tale',
      year: 2009,
      isAnimated: false
    };

    let slinky = {
      name: 'Slinky',
      type: 'Dachshund',
      url: '/dogs/slinky.jpg',
      media: 'Toy Story',
      year: 1995,
      isAnimated: true
    };

    let dug =
    {
      name: 'Dug',
      type: 'Golden Retriever',
      url: '/dogs/dug.jpg',
      media: 'Up',
      year: 2009,
      isAnimated: true
    };

    test('POST hachiko to /api/dogs', async () => {
      hachiko.userId = user.id;
      const response = await request
        .post('/api/dogs')
        .send(hachiko);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(hachiko);

      //Update local client hachiko object
      hachiko = response.body;
    });

    test('PUT updated hachiko to /api/dogs/:id', async () => {
      hachiko.name = 'Hachi';

      const response = await request
        .put(`/api/dogs/${hachiko.id}`)
        .send(hachiko);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(hachiko);
    });

    test('GET list of dogs from /api/dogs', async () => {
      slinky.userId = user.id;
      const aDog = await request.post('/api/dogs').send(slinky);
      slinky = aDog.body;

      dug.userId = user.id;
      const anotherDog = await request.post('/api/dogs/').send(dug);
      dug = anotherDog.body;

      const response = await request.get('/api/dogs');

      expect(response.status).toBe(200);

      const expected = [hachiko, slinky, dug].map(dog => {
        return {
          userName: user.name,
          ...dog
        };
      });

      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    test('GET dug from /api/dogs/:id', async () => {
      const response = await request.get(`/api/dogs/${dug.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...dug, userName: user.name });
    });

    test('DELETE slinky from /api/dogs/:id', async () => {
      const response = await request.delete(`/api/dogs/${slinky.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(slinky);

      const getResponse = await request.get('/api/dogs');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.find(dog => dog.id === slinky.id)).toBeUndefined();
    });

    describe('seed data tests', () => {

      beforeAll(() => {
        execSync('npm run setup-db');
      });

      it('GET /api/dogs', async () => {
        // act - make the request
        const response = await request.get('/api/dogs');

        // was response OK (200)?
        expect(response.status).toBe(200);

        // did it return some data?
        expect(response.body.length).toBeGreaterThan(0);

        // did the data get inserted?
        expect(response.body[0]).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          type: expect.any(String),
          url: expect.any(String),
          media: expect.any(String),
          year: expect.any(Number),
          isAnimated: expect.any(Boolean),
          userId: expect.any(Number),
          userName: expect.any(String)
        });
      });
    });

    // If a GET request is made to /api/cats, does:
    // 1) the server respond with status of 200
    // 2) the body match the expected API data?
    it.skip('GET /api/dogs', async () => {
      // act - make the request
      const response = await request.get('/api/dogs');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return the data we expected?
      expect(response.body).toEqual(expectedDogs);

    });

    // If a GET request is made to /api/cats/:id, does:
    // 1) the server respond with status of 200
    // 2) the body match the expected API data for the cat with that id?
    it.skip('GET /api/dogs/:id', async () => {
      const response = await request.get('/api/dogs/2');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedDogs[1]);
    });
  });
});