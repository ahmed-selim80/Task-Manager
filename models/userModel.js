const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true , 'User must have a name']
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail , "You must enter a proper Email"],
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: true,
        validate : {
            validator: function(val){
                return val === this.password;
            },
            message: "Passwords MUST match"
        }
    },

    role: {
        type: String,
        enum: ['user' , 'admin'],
        default: "user"
    },

    passwordChangedAt: {
        type: Date,
    },

    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// Pre save function to hash password before storing them in the database
userSchema.pre("save" , async function(){
    
    // if he has modified anything other than password , we don't wanna hash it again
    if(!this.isModified("password")) return;

    // other than than feel free to hash it (new user , modified password)
    this.password = await bcrypt.hash(this.password , 10);
    this.passwordConfirm = undefined;
})

userSchema.pre(/^find/ , async function(){
    this.find({active : {$ne : false}});
})


// checks if passwords match (plain text , hashed)
userSchema.methods.passwordsMatch = async function(candidatePassword , DBPassword){
    return await bcrypt.compare(candidatePassword , DBPassword);
};



const User = mongoose.model("User" , userSchema);
module.exports = User;