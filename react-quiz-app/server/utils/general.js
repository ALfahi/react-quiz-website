import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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