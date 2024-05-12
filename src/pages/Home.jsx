import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import elipseImage1 from "../assets/Images/Ellipse 1.png";
import elipseImage2 from "../assets/Images/Ellipse 2.png";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import "./Home.css";
import ReviewSlider from "../components/common/ReviewSlider";
const Home = () => {
  return (
    <div>
      {/* {Section 1} */}

      <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white">
        <Link to={"/signup"}>
          <div
            className="  group mt-24 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit shadow-md shadow-pure-greys-500   "
          >
            <div
              className=" flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
              transition-all duration-200 group-hover:bg-richblack-900"
            >
              <p>Become a Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className=" text-center font-semibold text-white mt-9 text-4xl">
          Empower Your Future With
          <HighlightText text={"Coding Skills"} />
        </div>

        <div
          className=" w-[90%] mt-6 text-richblack-300 
         font-bold text-lg text-center  "
        >
          <p>
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.{" "}
          </p>
        </div>

        {/* buttons */}
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
        {/* video   */}
        <div className="mx-3 my-14 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* {code section 1} */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="font-semibold text-white mt-7 text-4xl">
                Unlock your
                <HighlightText text={"Coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={`Our courses are designed and taught by industry experts 
                       who have years of experience in coding and are passionate about sharing
                        their knowledge with you.`}
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* {code section 2} */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="font-semibold text-white mt-7 text-4xl">
                Start
                <HighlightText text={"Coding in seconds"} />
              </div>
            }
            subheading={`Go ahead, give it a try. Our hands-on learning environment
            means you'll be writing real code from your very first lesson.`}
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/login",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<<!DOCTYPE html>>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n`}
            codeColor={"text-blue-25"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        <ExploreMore />

      </div>

      {/* {section2} */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
           {/* Explore Full Catagory Section */}
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-6 mx-auto justify-between">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white  lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>
        </div>


        <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-8 mx-auto justify-between">
            {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="lg:w-[45%] text-richblack-900 font-bold text-4xl">
              Get the skills you need for a
              <HighlightText text={" job that is in demand"} />
            </div>
            <div className=" w-[40%] flex flex-col items-start gap-10  ">
              <p className=" text-richblack-700 py-6 text-[16px] font-semibold">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <CTAButton active={true} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* section3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 *:bg-richblack-900 text-white">
        <InstructorSection />
        <h2 className="text-center text-4xl font-semibold mt-10">
          Reviews from others Learners
        </h2>
        {/* review slilder here */}
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
