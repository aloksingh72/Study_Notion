const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");

const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");




// initiate the  razorpay order

exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }
    let totalAmount = 0;
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({
                    success: false,
                    message: "Could not find the course"
                });
            }
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Students is already Enrolled"
                });

            }
            totalAmount += course.price;

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }


    };

    const options = {
        amount: totalAmount = 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }
    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order"
        })
    }



};


// verify the payment 

exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed"
        });

    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        //enroll karwao student ko
        await enrollStudents(courses, userId, res);
        //return res
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }
    return res.status(200).json({ success: "false", message: "Payment Failed" });

}


//enrolled the students
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({
            success: "false",
            message: "Please Provide data for Courses or UserId"
        });
    }
    for (const courseId of courses) {
        try {
            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            )
            if (!enrolledCourse) {
                return res.status(500).json({
                    success: true,
                    message: "Course not Found"
                })
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })



            // find the student and add the course to thier list of enrolledCourses

            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    }
                }, { new: true })

            // student ko mail send kar denge
            const emailResponse = await mailSender(
                enrollStudents.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
            // console.log("Email Sent Successfully", emailResponse.response);
        } catch (err) {

            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }

}


// send payment successEmail
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount / 100, orderId, paymentId)
        )
    }
    catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({ success: false, message: "Could not send email" })
    }
}

















// //capture the payment and initiate the razorpay order

// exports.capturePayment = async (req, res) => {

//     //get course id ans UserID
//     const { course_id } = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseid
//     if (!course_id) {
//         return res.json({
//             seccess: false,
//             message: "Please provide valid course id",
//         })

//     };
//     //valid courseDetails
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if (!course) {
//             return res.json({
//                 success: falsse,
//                 message: 'Could not find the course',
//             });
//         }
//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if (course.studentEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success: false,
//                 message: "student already enrolled for this course",
//             });

//         }
//     } catch (err) {
//         console.err(err);
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });

//     }
//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId,

//         }
//     };
//     try {
//         //initiate the payment using the razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         });


//     } catch (err) {
//         console.log(err);
//         res.json({
//             success: false,
//             message: "Could mot initiate order",
//         });

//     }
// };
// //verify signature of Razorpay and server


// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];
//     const shasum = crypto.createHemac("sha256", webhookSecret);

//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if (signature === digest) {
//         console.log("Payment is Authorrised");


//         const { courseId, userId } = req.body.payload.payment.entity.notes;
//         try {

//             //fulfull the action
//             //find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 { _id: courseId },
//                 { $push: { studentEnrolled: userId } },
//                 { new: true },
//             );
//             if (!enrollmentCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found',
//                 });
//             }

//             console.log(enrolledCourse);
//             //find the student and add the course to their list enrolled courses me
//             const enrolledStudent = await User.findOneAndUpdate(
//                 { _id: userId },
//                 { $push: { courses: courseId } },
//                 { new: true },
//             );
//             console.log(enrolledStudent);
//             //mailsend kerdo confirmation wala
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from Study notion",
//                 "Congratulations , you are onboard into new codeHelp course",

//             );
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature Verified and Course Added",
//             });

//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: err.message,
//             });

//         }
//     }
//     else {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request",

//         });
//     }

// }


