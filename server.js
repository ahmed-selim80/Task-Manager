// server.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DB_CONNECTION_STRING
  .replace('<USERNAME>', process.env.DB_USERNAME)
  .replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('ERROR CONNECTING TO DATABASE:', err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});