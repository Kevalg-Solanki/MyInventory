//external modules
const dotenv = require("dotenv");
const path = require("path");

//config
const connectToDb = require("./config/connectToDb");

//--App
const app = require("./app");



dotenv.config({path:path.resolve(__dirname,'../.env')});
//connect to the database
connectToDb();

//Main 
const PORT = process.env.PORT;


//start server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});

