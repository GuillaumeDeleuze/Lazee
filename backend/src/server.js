import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import tasksRoute from './routes/tasksRoute.js';
import routinesRoute from './routes/routinesRoute.js';

dotenv.config();
const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());

//our custome simple middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

const PORT = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/tasks', tasksRoute);
app.use('/api/routines', routinesRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
