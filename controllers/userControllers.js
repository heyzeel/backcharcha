const User = require("../models/userModel")
const generateToken = require("../config/generateToken")
const cloudConfig = require("../config/cloudinaryConfig")
const fs = require("fs")

const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log(name)
    try {
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please enter all the Fields");
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists")
        }

        const user = await User.create({
            name,
            email,
            password,
            pic
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
        else {
            res.status(400);
            throw new Error("Failed to create new User!")
        }
    }
    catch (error) {
        console.log(error.message)
        process.exit();
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            success:true,
        })
    }
    else{
        res.json({
            success:false,
        })
    }
}

const getProfileUrl = async(req, res)=>{
    const img = await cloudConfig(req.file.path)
    await res.json({url : img.url})
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err)
          return
        }
        //file removed
      })
}

const allUsers = async(req, res)=>{
    const keyword = req.query.search&&
    {$or:[
        {name:{$regex : req.query.search, $options:"i"}},
        {email:{$regex : req.query.search, $options:"i"}},
    ]};
    const users = await User.find(keyword).find({_id:{$ne:req.user.id}});
    res.send(users)
}

module.exports = { registerUser, authUser, getProfileUrl, allUsers}