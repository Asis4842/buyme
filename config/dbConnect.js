const { default: mongoose } = require("mongoose")

const dbConnect =()=>{
    try{
        const conn = mongoose.connect(process.env.MONGO_URL)
    console.log("Db connect")
    }catch(err){
        console.log("database ERRor")
    }
   
}

module.exports = dbConnect