// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectToDatabase from './connect.js';
// Import routes
import userRoutes from './routes/userRoutes.js';
//import quizRoutes from './routes/quizRoutes.js';

dotenv.config({ path: './config.env' });
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON

async function startServer() {
    await connectToDatabase(); // Wait for MongoDB connection

    app.listen(3001, () => {
        console.log('🚀 Server is running on port 3001');
    });
}

// Use routes
app.use('/api/users', userRoutes);

startServer();