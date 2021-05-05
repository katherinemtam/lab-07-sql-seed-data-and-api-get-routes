/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

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
app.post('/api/dogs', async (req, res) => {
  try {
    const dog = req.body;

    const data = await client.query(`
          INSERT INTO dogs (name, type, media, year, is_animated)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, name, type, media, year, is_animated as "isAnimated";
        `, [dog.name, dog.type, dog.media, dog.year, dog.isAnimated]);

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
        media = $3,
        year = $4,
        is_animated = $5
    WHERE id = $6
    RETURNING id, name, type, media, year, is_animated as "isAnimated";
    `, [dog.name, dog.type, dog.media, dog.year, dog.isAnimated, req.params.id]);

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
      SELECT  id,
              name,
              type,
              media,
              year,
              is_animated as "isAnimated"
      FROM    dogs;
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
      SELECT  id,
              name,
              type,
              media,
              year,
              is_animated as "isAnimated"
      FROM    dogs
      WHERE   id = $1;
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