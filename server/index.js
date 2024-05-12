const express = require("express");
const app = express();
 

const courseRoutes = require("./routes/Course");
const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");

 

 const dbConnect = require("./config/database");
 const cookieParser = require("cookie-parser");
 const cors = require("cors");
 const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv"); 

dotenv.config(); 
const PORT = process.env.PORT || 4000;
//database connect 
dbConnect();
//middlewares

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
//cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);
// app.use("/api/v1/reach", contactUsRoute);

//default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message:'Your server is up and running...',
    });
});

app.listen(PORT, () =>{
    console.log(`App is running at ${PORT}`);
})