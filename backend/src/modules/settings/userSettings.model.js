const mongoose = require("mongoose"); 


const userSettings = mongoose.Schema(
    {
        displayPreferences:{
            theme:{type:String,enum:["Dark","Light"]},
            saleSummary:{type:String,enum:["None","Week","Month","Year"]}
        },
        systemPreferences:{
            
        }
    }
)