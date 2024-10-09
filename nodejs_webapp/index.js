const express = require('express');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');

const app = express();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => console.log('morgan message:',message.trim()),
    },
  }
);

async function connect() {
  try {
    let connected = false;

    console.log(`Database connection status: ${connected}`);
    // Establish connection to 
    if (connected === false) {
      console.log('Trying database connection ...');
      const mongo = new MongoClient('mongodb://127.0.0.1:27017');

      const client = await mongo.connect()
      connected = true;
      const ping_res = await client.db().admin().ping();
      console.log('Database connection successful, ping:', ping_res);
      return client;
    } else {
      console.log('Database already connected');
      return
    }

  } catch (error) {

    
      console.error('\x1b[36m', `Error establishing a database connection`, '\x1b[0m', JSON.stringify(error));

      console.log('\x1b[36m', `Error Type:`, '\x1b[0m', error.name); // Error Type: in this case just Error
      console.log('\x1b[36m', ' Error Message:', '\x1b[0m', error.message); // Error Message: The string we’ve passed as an argument to the error constructor in the try block
      console.log('\x1b[36m', 'Error Stack: ', '\x1b[0m', error.stack)
    
  }
}

app.use(morganMiddleware);

async function getJsonplaceholder(params) {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/${params}`);

  return response.data;
}

app.get('/', async (req, res, next) => {
  try {
    const response = await getJsonplaceholder('posts');

    res.json({
      title: 'Home page',
      data: response,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/posts', async (req, res, next) => {
  connect()
  try {
    const response = await getJsonplaceholder('posts');

    res.json({
      title: 'posts',
      data: response,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/users', async (req, res, next) => {
  connect()
  try {
    const response = await getJsonplaceholder('users');
    res.json({
        title: 'users',
        data: response,
      });
  } catch (err) {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port: ${server.address().port}`);
});

function cleanupAndExit() {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);