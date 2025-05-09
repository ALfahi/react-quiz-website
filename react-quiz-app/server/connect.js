import mongoose from 'mongoose';

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

export default connectToDatabase;