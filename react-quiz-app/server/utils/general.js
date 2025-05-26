import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';


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