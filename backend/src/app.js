//external modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");


//creating express app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.json());


//logging middleware
app.use(morgan(':method :url :status :res[content-length - :response-time ms'));



//--ROUTES



//Error handler
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({
        success:false,
        statusCode:500,
        error:err,
        message:'Something went wrong!'
    });

})

module.exports = app;
