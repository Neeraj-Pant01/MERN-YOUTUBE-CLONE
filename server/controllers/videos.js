const videoModel = require("../models/video.model.js");
const CreateError = require("../utils/CreateError.js");


exports.addVideo = async(req,res,next)=>{
    const newVideo = new videoModel({userId:req.user.id,...req.body});
    try{
        await newVideo.save();
        res.status(200).json(newVideo);
    }catch(err){
        next(err)
    }
}

exports.updateVideo = async(req,res,next)=>{
    try{
        const video = await videoModel.findById(req.params.id)
        if(!video) return next(CreateError(404,"video not found"))

        if(req.user.id === video.userId){
            const Updatedvideo = await videoModel.findByIdAndUpdate(req.params.id,{
                $set : req.body
            },{
                new:true
            })
        res.status(200).json(Updatedvideo)
        }else{
            return next(CreateError(400,"you can update only your video !"))
        }
    }catch(err){
        next(err)
    }
}

exports.deleteVideo = async(req,res,next) =>{
    try{
        const video = await videoModel.findById(req.params.id);
        if(!video) return next(CreateError(404,"video not found !"))

        if(req.user.id === video.userId){
            await videoModel.findByIdAndDelete(req.params.id);
            res.status(200).json({mesage:"video deleted successfully !"})
        }
        else{
            return next(CreateError(400,"you cannot delete this video !"))
        }
    }catch(err){
        next(err)
    }
}

exports.getAvideo = async (req,res,next) =>{
    try{
        const video = await videoModel.findById(req.params.id)
        res.status(200).json(video)
    }catch(err){
        next(err)
    }
}

exports.addView = async(req,res,next) =>{
    try{
        const video = await videoModel.findByIdAndUpdate(req.params.id,{
            $inc : {views : 1}
        })
        res.status(200).json({message:"view has been added"})
    }catch(err){
        next(err)
    }
}

exports.getTheRandom = async(req,res,next) =>{
    try{
        const videos = await videoModel.aggregate([{$sample : {size:20}}])
        res.status(200).json(videos);
    }catch(err){
        next(err)
    }
}

exports.getTheTrending = async(req,res,next) =>{
    try{
        const videos = await videoModel.find().sort({views : -1})
        res.status(200).json(videos)
    }catch(err){
        next(err)
    }
}

exports.getByTag = async(req,res,next)=>{
    const tags = req.query.tags.split(",");
    try{
        const videos = await videoModel.find({tags : {$in: tags}}).limit(20);
        res.status(200).json(videos)
    }catch(err){

    }
}


exports.search = async (req, res, next) => {
    const query = req.query.q;
    try {
      const videos = await videoModel.find({
        title: { $regex: query, $options: "i" },
      }).limit(40);
      res.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };


//get all subscribed channels
exports.subscribed = async(req,res,next) =>{
    try{
        const user = await usersModels.findById(req.user.id);
        const subsChannels = user.subscribedusers;

        const list = await Promise.all(subsChannels.map(async(channelId)=>{
            return await videoModel.find({userId:channelId})
        }))
        res.status(200).json(list.flat().sort((a,b)=>b.createdAt - a.createdAt))
    }catch(err){
        next(err)
    }
}


