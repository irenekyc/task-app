const express = require ('express')
const router = new express.Router()
const User = require ('../models/user')
const auth = require('../middleware/auth')
const multer = require ('multer')
const sharp = require ('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require ('../emails/account')

router.get('/test', (req, res)=>{
    res.send('From a new file')
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch (e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

//Upload user profile
const upload = multer ({
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb (new Error('Please upload an image'))
            }
            cb(undefined, true)
        }
    })

router.post ('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    //sharp is the npm library to crop and resize > .png() to convert all file to png
    //resize ({width: , height})
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            throw new Error ('Please authenicate')
        } else if (!user.avatar) {
            throw new Error ('You have not yet uploaded an avatar')
        }
        // to set up the image to the url
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


//APP.POST IS TO CREATE A NEW USER / TASK
router.post('/users', async (req, res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    //     //status is to set up the status to 400 which is bad request
    // })
})

//APP.get TO READ USER / TASK (EITHER WITH A LIST OR EITHER SPECIFIC)
//A LIST of USERS
router.get('/users/me', auth, async (req, res)=>{
    try{
        res.send(req.user)
    } catch (e){
        res.status(500).send(e)

    }
    // User.find({}).then((users)=>{
    //     res.status(302).send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})
//PARTICIULAR USER
// router.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.sendStatus(500).send()

    // }
    // User.findById(_id).then((user)=>{
    //     if(!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
// })

//app.patch is designed to update resources
router.patch('/users/me', auth, async(req, res)=>{
    //Object.keys is to convert object into array
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    //below are to validate if the user input validate update
    const isValidated = updates.every((update) => {
        return allowUpdates.includes(update)
    })
    if(!isValidated) {
        return res.status(400).send( {error: 'Invalid updates'})
    }
    try {
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
       // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

//APP.DELETE is to delete document
router.delete('/users/me', auth, async (req, res)=>{

    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }catch (e){
        res.status(500).send(e)
    }
})


module.exports = router