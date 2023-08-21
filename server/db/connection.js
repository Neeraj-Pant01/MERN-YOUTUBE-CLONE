const mongoose = require("mongoose");

const connection = async () =>{
    try{
        await mongoose.connect(`${process.env.DBURL}`)
        console.log("database is connected successfully !")
    }catch(err){
        console.log("unable to connect the database")
    }
}

module.exports = connection;