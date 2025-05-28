import fs from 'fs/promises';
import Quiz from '../models/quizModel.js';

export async function createQuiz(req, res) {
    try{
        const file = req.file;
        let {username, questions, title} = req.body;
        let imageUrl = 'quizDefault.png';// have a fall back in case user did not add in a custom banner file.
        if (file)// user uploaded a custom quiz banner.
        {
            imageUrl = file.filename;// grab url from multer.
        }

        let newQuiz = Quiz({
            title: title,
            imageUrl: imageUrl,
            questions: JSON.parse(questions),
            createdBy: username,
            isPublic: false,
            status: 'pending',
        })

        await newQuiz.save();
        
        res.status(201).json({ message: 'Quiz created successfully'});
    }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error creating quiz' });

            // Cleanup image if there was one uploaded as even when a wasn't uploaded to db, the image was still uploaded.
            if (req.file) {
                try {
                await fs.unlink(req.file.path); // Delete the uploaded file
                console.log("Deleted image due to quiz creation error.");
                } catch (deleteErr) {
                console.error("Failed to delete image:", deleteErr);
                }
            }
        }
}

export async function getQuizzes(req, res) {
    // to do.
}