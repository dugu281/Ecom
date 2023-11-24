const express = require('express');
const router = express.Router();
const multer = require('multer');

require('dotenv').config();


//mongo DATA
const dbURI = process.env.DB
mongoose.Promise = global.Promise;
// mongoose.connect(bdURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.createConnection(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//init gfs
let gfs;

conn.once("open", () => {
    //initialize the stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

//creating the storage engine for MONGO
const storage = new GridFsStorage({
    url: dbURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
    }
});



const upload = multer({ storage: storage });

//set storage engine with multer for disk
const diskstorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname + '/uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const diskupload = multer({ storage: diskstorage });





// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {      // file- file to be uploaded,  cd - content buffer
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({
//     storage: storage,                // first storage - attribute and second storage for above function name "const storage"
//     limits: {
//         fileSize: 1024 * 1024 * 10    // 10MB
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
//             cb(null, true);
//         }
//         else {
//             cb(null, false)
//             return res.status(400).json({ error: "File types allowed are .png, .jpg, .jpeg" });
//         }

//     }

// })


// implementing upload image functionality
router.post('/uploadFile', upload.single('file'), function (req, res) {
    res.json({ "fileName": req.file.filename });
})


// Upload profilePic route
router.post('/uploadProfilePic', upload.single('file'), function (req, res) {
    res.json({ "fileName": req.file.filename });
})



// implementing download file functionality
const downloadFile = (req, res) => {
    const fileName = req.params.filename;
    const path = __basedir + "/uploads/";   // path relatate to the path inside server.js file

    res.download(path + fileName, (error) => {
        if (error) {
            res.status(500).send({ message: "File cannot be downloaded!" + error });
        }
    })
}

router.get('/files/:filename', downloadFile);     // for uploading and downloading files


module.exports = router;












//route for POST - upload data to mongo
app.post('/upload', upload.single('file'), (req, res) => {
    console.log({ file: req.file });
    // res.json({ file: req.file });
    res.redirect('/');
});

//route for POST - upload data to disk
app.post('/uploaddisk', diskupload.single('file'), (req, res, next) => {
    const file = { file: req.file };
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.redirect('/');
});



