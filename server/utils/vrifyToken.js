const jwt = require("jsonwebtoken");
const CreateError = require("./CreateError");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token,process.env.KEY,(err, payload)=>{
            if(err) return next(CreateError(404,"token is not valid"))
            req.user = payload;
            next()
        })
    }else{
        next(CreateError(404,"you are not authenticated !"))
    }
}

module.exports = verifyToken;