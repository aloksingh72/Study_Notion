const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token
            || req.body.token || req.header("Authorization").replace("Bearer ", "");
        // console.log(token);

        //if token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing",
            });

        }

        //verify the token
        try {
            // Verifying the JWT using the secret key stored in environment variables
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (err) {
            //verification -- issue
            return res.status(401).json({
                success: false,
                message: "token is not valid",
            });
        }
        // If JWT is valid, move on to the next middleware or request handler
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });

    }
}

//is Student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for student only",
            });
        }
        next();


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , please try again",
        });

    }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor only",
            });
        }
        next();


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , please try again",
        });

    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin only",
            });
        }
        next();


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , please try again",
        });

    }
}