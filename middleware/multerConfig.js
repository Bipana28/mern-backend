const multer =require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {// multer le file lai kaha rakhnai ho bhanera sochdaina, so we have to tell it

    const allowedFileTypes=['image/jpg', 'image/png', 'image/jpeg', 'image/svg+xml']
    if(!allowedFileTypes.includes(file.mimetype)){
         cb(new Error('File type not allowed'));
         return
        }
        cb(null, './storage');// cb(error,success) ...../storage is the folder where we want to store the file
    },// cb vaneko callback function

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)//bipana- is the prefix we want to add to the file name
    }
});


module.exports = {
    multer,
    storage // export garna parchas
}
