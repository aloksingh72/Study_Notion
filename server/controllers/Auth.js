const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const  mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");


//send otp
exports.sendOtp = async (req, res) => {

    try {
        //fetch email from request ki body
        const { email } = req.body;

        //check if user is already exist
        const checkUserPresent = await User.findOne({ email });

        //if user is already present
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User is  already exists"
            })
        }
        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated : ", otp);

        //checking unique otp or not
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });

        }
        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response succesful
        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })

    }
};


//signup Controllers for Registration Users
exports.signUp = async (req, res) => {
    try {
        //data fetch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validating the upper details in DB

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fileds are required",
            })

        }
        // 2 password are matching
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password does not match",
            });
        }

        //check if user already exists or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered. Please sign in to continue.",
            });
        }
        //find most recent otp for the email
        const recentOtp = await OTP.findOne({ email }).sort({ createAt: -1 }).limit(1);
        console.log(recentOtp);

        //validate otp
        if (recentOtp.length  === 0) {
            //otp not found
            return res.status(400).json({
                success: false,
                message: "otp not found"
            });
        } else if (otp != recentOtp.otp) {
            //invalid otp 
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            });

        }
        // hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create the user
        let approved = "";
        approved ==="Instructor" ? (approved = false) :(approved = true);

        //create the additional profile for User (-- entry create in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x.initials/svg?seed=${firstName}${lastName}`,
        });
        //return res
        return res.status(200).json({
            success: true,
            message: "User is already registered successfully",
            user,
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be redistered Please try again",
        });
    }
};




//login controller for authenticating users
exports.login = async (req, res) => {
    try {
        //get data from req body

        const {email,password} = req.body;
        //validation data (check if email or padssword is missing)
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fileds are required , please try again",
            });

        }
        // find user with provided email (user check exist or not )
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",

            });
        }
        //generate JWT token ,after password matching
      if(await bcrypt.compare(password, user.password)){
        const payload  = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
          //generating... jwt token
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });
        user.token = token;
        user.password = undefined;


        //create cookie and send response
        const options ={
            expries:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token, options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully",

        })
      }
        else{
            return res.status(401).json({
                success:false,
                message:"password does not matched",
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failure, please try again",
        });

    }
};


//change password
exports.changePassword = async(req,res) =>{
//get data from req body
//get oldpassword ,newpassword,confirm New password
//validation

//update pass in DB
//send mail - password updated
//return response
}