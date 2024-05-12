const profile = require("../models/Profile");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateProfile = async (req, res) => {
    try {
        //get data 
        const { gender, dateOfBrith = "", about = "", contactNumber= "" } = req.body;
        //get userid
        const id = req.user.id;
        //validation
        if (!gender || !contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are requried "
            })
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionlDetails;
        const profileDetails = await profile.findById(profileId);
        //updateprofile
        profileDetails.dateOfBrith = dateOfBrith;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile is updated successfully",
            profileDetails,
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong during the updation"
        })

    }
}

//deleteAccount

exports.deleteAccount = async (req, res) => {
    try {
        //get id 
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "All fields are requried ,so sory triy agin "
            });
        }
        //delete profile
        await profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //todo:hw- unroll user from all enrolled course
        //delete user
        await User.findByIdAndDelete({ _id: id });

        //response 
        return res.status(200).json({
            success: true,
            message: "Account is delete successfully "
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong during the deletion"
        })
    }
}

//get handler

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //response
        return res.status(200).json({
            success: true,
            message: "User details fetching successfully done",
            data: userDetails,
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong during the detals fetching"
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


  exports.instructorDashboard = async (req, res) => {
    try {
      console.log("hello before instructor Dashboard.....................");
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
   
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  }