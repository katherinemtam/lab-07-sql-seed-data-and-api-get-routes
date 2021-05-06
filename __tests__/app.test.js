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
        id: expect.any(Number),
        name: 'Beethoven',
        type: 'St Bernard',
        media: 'Beethoven',
        year: 1992,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Benji',
        type: 'Mutt',
        media: 'Benji',
        year: 1974,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Rin Tin Tin',
        type: 'German Shepherd',
        media: 'The Adventures of Rin Tin Tin',
        year: 1954,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Hachiko',
        type: 'Akita',
        media: 'Hachi: A Dog\'s Tale',
        year: 2009,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'K.K. Slider',
        type: 'Jack Russell Terrier',
        media: 'Animal Crossing',
        year: 2001,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Goofy',
        type: 'Coonhound',
        media: 'Mickey\'s Revue',
        year: 1932,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Bolt',
        type: 'German Shepherd',
        media: 'Bolt',
        year: 2008,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Pit Bull',
        type: 'Pit Bull',
        media: 'John Wick',
        year: 2014,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Slinky',
        type: 'Dachshund',
        media: 'Toy Story',
        year: 1995,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Lady',
        type: 'Cocker Spaniel',
        media: 'Lady and the Tramp',
        year: 1995,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Tramp',
        type: 'Irish Terrier',
        media: 'Lady and the Tramp',
        year: 1995,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Lassie',
        type: 'Rough Collie',
        media: 'Lassie Come Home',
        year: 1943,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Snoopy',
        type: 'Beagle',
        media: 'Peanuts',
        year: 1950,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Toto',
        type: 'Cairn Terrier',
        media: 'The Wizard of Oz',
        year: 1939,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Blue',
        type: 'Bull Terrier',
        media: 'Blue\'s Clues',
        year: 1996,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Wishbone',
        type: 'Jack Russell Terrier',
        media: 'Wishbone',
        year: 1995,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Buddy',
        type: 'Golden Retriever',
        media: 'Air Bud',
        year: 1997,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Dug',
        type: 'Golden Retriever',
        media: 'Up',
        year: 2009,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Marley',
        type: 'Labrador Retriever',
        media: 'Marley & Me',
        year: 2008,
        isAnimated: false
      },
      {
        id: expect.any(Number),
        name: 'Scooby-Doo',
        type: 'Great Dane',
        media: 'Scooby-Doo Where Are You!',
        year: 1969,
        isAnimated: true
      },
      {
        id: expect.any(Number),
        name: 'Santa\'s Little Helper',
        type: 'Greyhound',
        media: 'The Simpsons',
        year: 1989,
        isAnimated: true
      },
    ];

    let hachiko = {
      id: expect.any(Number),
      name: 'Hachiko',
      type: 'Akita',
      media: 'Hachi: A Dog\'s Tale',
      year: 2009,
      isAnimated: false
    };

    let slinky = {
      id: expect.any(Number),
      name: 'Slinky',
      type: 'Dachshund',
      media: 'Toy Story',
      year: 1995,
      isAnimated: true
    };

    let dug =
    {
      id: expect.any(Number),
      name: 'Dug',
      type: 'Golden Retriever',
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

    test.skip('GET list of dogs from /api/dogs', async () => {
      const aDog = await request.post('/api/dogs').send(slinky);
      slinky = aDog.body;
      const anotherDog = await request.post('/api/dogs/').send(dug);
      dug = anotherDog.body;

      const response = await request.get('/api/dogs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([hachiko, slinky, dug]));
    });

    test.skip('GET dug from /api/dogs/:id', async () => {
      const response = await request.get(`/api/dogs/${dug.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dug);
    });

    test.skip('DELETE slinky from /api/dogs/:id', async () => {
      const response = await request.delete(`/api/dogs/${slinky.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(slinky);

      const getResponse = await request.get('/api/dogs');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(expect.arrayContaining([hachiko, dug]));
    });

    describe.skip('seed data tests', () => {

      beforeAll(() => {
        execSync('npm run setup-db');
      });

      it.skip('GET /api/dogs', async () => {
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
          media: expect.any(String),
          year: expect.any(Number),
          isAnimated: expect.any(Boolean)
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