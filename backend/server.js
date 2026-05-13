// Entry point for backend server
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv=require("dotenv")
dotenv.config()
const PORT = process.env.PORT ;
// Middleware
app.use(cors());    
// db connection 
const  connectDb=require("./config/db.js")
connectDb() 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// Routes
app.use("/auth", require("./routes/userRoutes.js"))
// post routes
app.use("/auth/v1", require("./routes/postRoutes.js"))
// comment routes
app.use("/auth/v2", require("./routes/commentRoutes.js"))



app.get('/', (req, res) => {
    res.send('Hello from the backend!'); 
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 