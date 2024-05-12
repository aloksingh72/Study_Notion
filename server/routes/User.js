
const express = require("express");
const router = express.Router();

const {
    login,
    signUp,
    sendOtp,
    changePassword,
} = require("../controllers/Auth");
const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");


const {auth} = require("../middlewares/auth");

//routes for login ,Signup,and Authentication
//**************************************************
//                     Authentication Routes
//***************************************************
// Routes fort user login
router.post("/login",login);
//Route for user signup

router.post("/signup",signUp);

//Route for sending otp to the user's email
router.post("/sendotp",sendOtp)

//route fot changing the password
router.post("/changepassword",auth, changePassword)

//********************************************* */
//                        ResetPassword
//*********************************************
router.post("/resetPasswordToken",resetPasswordToken);
router.post("/resetpassword",resetPassword);

//Export for router for use inthe main application
module.exports = router;