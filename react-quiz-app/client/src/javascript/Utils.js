
export function editImage(setImageURL, setImageFile, newURL, file = null) {
    setImageURL(newURL);
    setImageFile(file); // null means default image
}
export function changeFileImage(event, setImageURL, setImageFile)// setImage is a file Object from the input type = 'file attribute.
{
    const file = event.target.files[0];// returns null if nothing in the array.


    if (!isValidImageType(file))
    {
        return;
    }
    else
    {
        // convert the passed in file into a url and then edit the banner image.
        const url = URL.createObjectURL(file);
        editImage(setImageURL, setImageFile, url, file);
    }
}

// This function checks if the user has uploaded an image, it then checks if it's in the correct format. returns a boolean
//
export function isValidImageType(file) {
    const allowedTypes = ["image/png","image/jpeg","image/jpg","image/bmp","image/webp","image/x-icon","image/tiff"];
    
    return file && allowedTypes.includes(file.type);
  }
/*************************GETTER and SETTERS ***************/

export function getTotalQuestionsLocal()// gets total number of questions of a quiz from local storage
{
    return parseInt(localStorage.getItem("totalQuestions"));
}


/*************************SOME GENERAL FUNCTIONS ***************/

export function validateTextLength(text, minLength, maxLength)// checks if the text is between the min and max length
{
    return text.length >= minLength && text.length <= maxLength;
}


/******************* some general functions needed to connect client to back end ***/

// This function gets a http response and then displays the necessary status error message client side, the actual status
// error messages are defined within the backend logic.
//
export async function displayResponseStatusMessages(response, setText, setMessageType)
{
    const data = await response.json();
    setText(data.message);
    if (response.ok)// success
    {
        setMessageType("sucess");
    }
    else// not successfull
    {
        setMessageType("error");
    }
}