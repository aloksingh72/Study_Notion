const express = require("express")
const router = express.Router()
const {auth, isInstructor} = require("../middlewares/auth")
const{

    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
} = require('../controllers/Profile');

//***************************************
//          Profile Routes
//*************************************** */
//delete User Account


router.put("/updateProfile",auth,updateProfile);
router.get("/getAllUserDetails",auth, getAllUserDetails);
router.delete("/deleteProfile", auth, deleteAccount)

//Get Enrolled courses
router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.put("/updateDisplayPicture",auth,updateDisplayPicture)
router.get("/instructorDashboard",auth,isInstructor,instructorDashboard)

module.exports = router;
