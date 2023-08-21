const UserModel = require("../models/users.models.js");
const bcrypt = require("bcrypt");
const CreateError = require("../utils/CreateError.js")
const jwt = require("jsonwebtoken")

exports.register = async (req,res,next) =>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password,salt)
    const newUSer = await UserModel({...req.body,password:hash})
    try{
        await newUSer.save()
        res.status(200).json(newUSer)
    }catch(err){
        next(err)
    }
}

exports.login = async (req,res,next) =>{
    try{
        const user = await UserModel.findOne({email:req.body.email})
        if(!user) return next(CreateError(404,"user not found"))

        const hashedPass = await bcrypt.compare(req.body.password, user.password)
        if(!hashedPass) return next(CreateError(404,"incorrect credentials !"))

        const token = jwt.sign({id:user._id},process.env.KEY,{expiresIn:"1d"})

        const {password,...others} = user._doc;

        res.status(200).json({
            others,
            token
        })

    }catch(err){
        next(err)
    }
}