const multer = require('multer');

const Storage = multer.diskStorage({
    destination: "/public/img/category",
    filename:function (req,res,cb){
        cb(null,file.originalname)
    }
})
const upload  = multer({
    storage:Storage
}).single("image")

module.exports = {upload}