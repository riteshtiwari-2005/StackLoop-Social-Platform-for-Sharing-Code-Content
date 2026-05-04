const mongoose=require("mongoose")
 const mongo_uri=process.env.MONGO_URI
const connectDb=async()=>{
    try{
 await mongoose.connect(mongo_uri)
 console.log("connection with db is successfull ")
    }

    catch(err)
    {
        console.log("connection with db failed", err);
    process.exit(1); // better than res.status here

    }

}


module.exports= connectDb;