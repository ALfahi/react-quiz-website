import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


// This function returns the entire contents of the specified file.
//
export function getFileContent(directory)
{
        // creating a directory name variable so we can easily grab the correct file:
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
       // absolute path to the HTML file
        const filePath = path.join(__dirname, directory);
        return fs.readFileSync(filePath, 'utf8');// returns the file's content.
}

// This general function is used to create a token from whatever payload it is passed in.
// returns the actual token
//
export function createJwtToken(payload, expiry = '15m') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
}

// This function is used to create and return an unique identifier, it checks the passed in model if a unqidie identifier already exists.
//
export async function getUniqueIdentifier(model)
{
    let modelId;
    let isUnique = false;
    while (!isUnique)
    {
        modelId = uuidv4();
        const doesExist = await model.findById(modelId);
        isUnique = !doesExist// if there was a match, then the uuid is not unique.
    }
    return modelId
}