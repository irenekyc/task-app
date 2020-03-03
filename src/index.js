const express = require ('express')
require('./db/mongoose')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')


const app = express()
const port = process.env.PORT

//add file upload
// const multer = require ('multer')
// //dest: destination where the file shoule be stored, it is in your file directory
// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize: 1000000 //1MB is the max file size restriction
//     },
//     //fileFilter to restrict the file type to be uploaded, cb is callback
//     //regular expression match(/ /) between  / /  there is a regular expression
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error ('Please upload a word document'))
//         }
//         cb (undefined, true)
//         // cb(new Error ('File must be a PDF'))
//         // cb(undefined, true)

//     }
// })

// multer middleware is different from auth (upload.single(String)) , 'upload' is the key where the website should find the file
// app.post('/upload', upload.single('upload'), (req, res)=>{
//     res.send()
// }, (error, req, res, next)=>{
//     res.status(400).send({error: error.message})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('Server is up on ' + port)
})

