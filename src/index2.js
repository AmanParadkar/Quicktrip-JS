import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './utils/database.js';
import User from './models/User.js';
// Import other models similarly

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Define routes
app.get('/quicktrip/hello', (req, res) => {
  res.send('hello');
});

app.use('/quicktrip/users', userRoutes);

// Define other routes for users, packages, reviews, bookings, etc.

// Database synchronization
sequelize
  .sync() // Sync the models with the database
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });