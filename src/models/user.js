const mongoose = require ('mongoose')
//validator
const validator = require('validator')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const Task = require ('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    age: {
        type: Number,
        default: 0,
        //this is to validate method not using validator
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email :{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        //uniqueiness need to set true
        unique: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password :{
        type: String,
        required: true,
        trim:true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain "password"')
            }

        }
    },
    avatar :{
        type: Buffer
    },
    tokens :[{
        token :{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//virtual properties to generate relationship
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})
//User login, checking email and password
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})
    if(!user) {
        throw new Error ('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error ('Unable to login')
    }
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}

//userSchema.pre before user is saved, there is .post after saving
userSchema.pre('save', async function(next) {
    const user = this
//isModified to check if certain field is modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    console.log('just before saving!')

    next()
})

//Delete user tasks when user is remove
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User