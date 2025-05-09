import Quiz from '../models/quizModel.js';

export async function createQuiz(req, res) {
    try{
        let {title, description, questions, createdBy} = req.body;

        let newQuiz = Quiz({
            title,
            description,
            questions,
            createdBy,
            isPublic: false,
            status: 'pending',
        })

        await newQuiz.save();
        
        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error creating quiz' });
        }
}

export async function getQuizzes(req, res) {
    // to do.
}