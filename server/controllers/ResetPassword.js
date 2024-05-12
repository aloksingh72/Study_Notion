const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");

//reset password token
exports.resetPasswordToken = async (req, res) => {


    try {
        //get email from req body
        const email = req.body.email;
        //check user for this email,email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "your email is not registered",
            });
        }
        //generate token
        const token = crypto.randomUUID();

        //update user by adding  token and expiration time
        const updateDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true });


        //create url
        const url = `https://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email,
            "password reset link",
            `password reset Link: ${url}. Please click this url to reset your password.`);

        //return response
        return res.json({
            success: true,
            message: "Email sent successfully. Please check your email and change password ",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });

    }

};

exports.resetPassword = async (req, res) => {
    try {
        //data fetch 
        const { password, confirmPassword, token } = req.body;
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching",
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({ token: token });
        //if no entry invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid",
            });
        }

        //token time check 
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Token is expired please regenerate your token",
            });

        }
        //hashed password 
        const encryptedPassword = await bcrypt.hash(password, 10);

        //password update
        await User.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true },
        );
        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset successflly",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail",

        });

    }
};

//