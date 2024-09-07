const mongoose = require("mongoose")
const bcrypt = require("bcryptjs") 

const userSchema = mongoose.Schema(
    {
        name : {type:String, required:true},
        email : {type:String, required:true, unique:true},
        password : {type:String, required:true},
        pic : {type:String, default:"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
        }
    },
    {
        timestamps:true,
    }
);

userSchema.methods.matchPassword = async function(enteredPassword){
    return bcrypt.compareSync(enteredPassword, this.password)
}

userSchema.pre("save", async function(next){
    if(!this.isModified){
        next();
    }
    const salt = bcrypt.genSaltSync(12)
    this.password =  bcrypt.hashSync(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;