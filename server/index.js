const express = require("express");
const dotenv = require("dotenv").config()
const cors = require("cors");
const connection = require("./db/connection");
const authRoute = require("./routes/auth")
const videoRoute = require("./routes/videos")
const userRoute = require("./routes/user.js")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())


app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "something went wrong !"
    return res.status(status).send(message);
})

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/videos',videoRoute)
app.use('/api/v1/users',userRoute)


app.listen(PORT,()=>{
    connection()
    console.log("app is listeming at the port " + PORT)
})