// used to parse body when file is being transferred
const multer = require('multer');

const MIME_TYPE_MAP={
    "image/jpeg":"jpg",
    "image/jpg":"jpg",
    "image/png":"png"
    }
    
    const storage = multer.diskStorage({
        destination: (req,file,cb) => {
            const isValid = MIME_TYPE_MAP[file.mimetype];
            let error = new Error("Invalid mime type");
            if(isValid){
                error = null;
            }
            cb(error,"api/images");
        },
        filename: (req,file,cb) =>{
            const name = file.originalname.toLowerCase().split(" ").join("-");
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null,name+"-"+Date.now()+"."+ext);
        }
    });
module.exports = multer({storage: storage}).single("image");    