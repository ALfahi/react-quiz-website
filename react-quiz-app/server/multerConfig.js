// This file is used to move uploaded image files to a folder within the server.
//
import multer from 'multer';
import path from 'path';

// Define storage location and naming
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // create an 'uploads/' folder if it doesn't exist
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        // adding inside an unique name identifier so we don't accidetnally overwrite any previoisly stored files.
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});

export const upload = multer({storage});