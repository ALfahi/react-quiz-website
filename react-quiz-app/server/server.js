// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectToDatabase from './connect.js';
// Import routes
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
//import quizRoutes from './routes/quizRoutes.js';

dotenv.config({ path: './config.env' });
const app = express();

// cors middleware:
app.use(cors());
// express.
app.use(express.json()); // Middleware for parsing JSON

// make the uploaded image folder public so front end can access them:
app.use('/uploads', express.static('uploads'));

// note: we use routes first, as the quizRoutes uses multer, so we need to use that before we use express.json().
// Use routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);


async function startServer() {
    await connectToDatabase(); // Wait for MongoDB connection

    app.listen(3001, () => {
        console.log('🚀 Server is running on port 3001');
    });
}

startServer();