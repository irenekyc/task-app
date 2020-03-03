const jwt = require ('jsonwebtoken')
const User = require ('../models/user')
//set up middleware, to try to verify the user using token
const auth = async (req, res, next) =>{
    try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    if (!user){
        throw new Error()
    }
    req.token = token
    req.user = user
    next()
    } catch (e) {
        res.status(401).send ({error: 'Please authenticate'})
    }

}

module.exports = auth









//Middleware to authentic user to signin
// app.use((req, res, next)=>{
//     if (req.method === "GET") {
//         res.send('Get request are disabled')
//     } else{
//         next()
//     }
//     // console.log(req.method, req.path)
//     // //req.method = your http method e.g. Get/Patch/Delete
//     // //req.path = the path/routing and the query
//     // next()
//     // //next is the default function to tell the programe to proceed to next
// })