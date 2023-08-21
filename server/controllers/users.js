const userModel = require("../models/users.models.js");
const CreateError = require("../utils/CreateError");
const videomodel = require("../models/video.model.js")

exports.update = async(req,res,next) =>{
    try{
        // const user = await userModel.findById(req.params.id);
        if(req.params.id === req.user.id){
            const updatedUser = await userModel.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{
                new:true
            })
            res.status(200).json(updatedUser)
        }else{
            return next(CreateError(400,"you can update only your account !"))
        }
    }catch(err){
        next(err)
    }
}

// exports.deleteUser = async(req,res,next) =>{
//     if(req.params.id === req.user.id){
//         try{
//             await userModel.findByIdAndDelete(req.params.id);
//         res.status(200).json({message:"account has been deleted !"})
//         }catch(err){
//             next(err)
//         }
//     }else{
//         return next(CreateError(400,"you can delete only your account !"))
//     }
// }

// exports.delete = async(req,res,next) =>{
//     try{
//         await userModel.findByIdAndDelete(req.user.id);
//         res.status(200).json({message:"user deleted !"})
//     }catch(err){
//         next(err)
//     }
// }

exports.deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
      try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
      } catch (err) {
        next(err);
      }
    } else {
      return next(CreateError(403, "You can delete only your account!"));
    }
  };


exports.getUser = async (req,res,next) =>{
    try{
        const user = await userModel.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        next(err)
    }
}

exports.subscribe = async(req,res,next) =>{
    try{
        const user = await userModel.findById(req.user.id);
        if(user.subscribedusers.includes(req.params.id)) return (next(CreateError(403,"you are already subscribed to this user !")))
        await userModel.findByIdAndUpdate(user._id,{
            $push :{subscribedusers:req.params.id}
        })
        await userModel.findByIdAndUpdate(req.params.id,{
            $inc : {subscribers: 1}
        })
        res.status(200).json({message:"user has been subscribed !"})
    }catch(err){
        next(err)
    }
}

exports.unsubscribe = async(req,res,next) =>{
    try{
        const user = await userModel.findById(req.user.id)
        if(!user.subscribedusers.includes(req.params.id)) return next(CreateError(403,"you are not subscribed to this user"))

        await userModel.findByIdAndUpdate(user._id,{
            $pull :{subscribedusers:req.params.id}
        })
        await userModel.findByIdAndUpdate(req.params.id ,{
            $inc :{subscribers: -1}
        })
        res.status(200).json({message:"subscription removed !"})
    }catch(err){
        next(err)
    }
}

exports.like = async(req,res,next) =>{
    try{
        const video = await videomodel.findByIdAndUpdate(req.params.id,{
            $addToSet :{likes:req.user.id},
            $pull : {dislikes:req.user.id}
        })
        res.status(200).json({message:"video has been liked !"})
    }catch(err){
        next(err)
    }
}

exports.dislike = async(req,res,next) =>{
    try{
        const video = await videomodel.findByIdAndUpdate(req.params.id,{
            $addToSet : {dislikes: req.user.id},
            $pull :{likes:req.user.id}
        })
        res.status(200).json({message:"video has been disliked !"})
    }catch(err){
        next(err)
    }
}