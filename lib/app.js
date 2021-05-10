/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import dogs from '../data/dogs.js'; //eslint-disable-line

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Famous Dogs API');
});

/*** API Routes ***/

// auth

app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email; 
    `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// dogs
app.post('/api/dogs', async (req, res) => {
  try {
    const dog = req.body;

    const data = await client.query(`
          INSERT INTO dogs (name, type, url, media, year, is_animated, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, name, type, url, media, year, is_animated as "isAnimated", user_id as "userId";
        `, [dog.name, dog.type, dog.url, dog.media, dog.year, dog.isAnimated, dog.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/dogs/:id', async (req, res) => {
  try {
    const dog = req.body;

    const data = await client.query(`
    UPDATE dogs
    SET name = $1,
        type = $2,
        url = $3,
        media = $4,
        year = $5,
        is_animated = $6
    WHERE id = $7
    RETURNING id, name, type, url, media, year, is_animated as "isAnimated", user_id as "userId";
    `, [dog.name, dog.type, dog.url, dog.media, dog.year, dog.isAnimated, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dogs/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM dogs
      WHERE id = $1
      RETURNING id, name, type, url, media, year, is_animated as "isAnimated", user_id as "userId";
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dogs', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
    SELECT  d.id,
            d.name,
            type,
            url,
            media,
            year,
            is_animated as "isAnimated",
            user_id as "userId",
            u.name as "userName"
    FROM    dogs d
    JOIN    users u
    ON      d.user_id = u.id;
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dogs/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
    SELECT  d.id,
            d.name,
            type,
            url,
            media,
            year,
            is_animated as "isAnimated",
            user_id as "userId",
            u.name as "userName"
    FROM    dogs d
    JOIN    users u
    ON      d.user_id = u.id
    WHERE   d.id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;