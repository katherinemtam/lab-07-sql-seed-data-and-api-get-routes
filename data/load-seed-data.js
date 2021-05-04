/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import dogs from './dogs.js';

run();

async function run() {

  try {

    await Promise.all(
      dogs.map(dog => {
        return client.query(`
          INSERT INTO dogs (name, type, media, year, is_animated)
          VALUES ($1, $2, $3, $4, $5);
        `, [dog.name, dog.type, dog.media, dog.year, dog.isAnimated]);
      })
    );


    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}