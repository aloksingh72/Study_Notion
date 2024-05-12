import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

function InstructorSection() {
  return (
    <div className="mt-12">
      <div className="flex flex-row gap-20 items-center">
        {/* left side box */}
        <div className="w-[50%]">
          <img src={Instructor} alt="instructor" className="shadow-white shadow-[-20px_-20px_0_0]" />
        </div>
        {/* right side box */}
        <div className="flex flex-col gap-10 w-[50%] ">
          
            <p className="text-richblack-5 font-bold text-4xl">
              Become an <br />
              <HighlightText text={" Instructor"} />
            </p>
            <p className="w-[80%] text-[16px]  text-richblack-300 mb-20">
              Instructors from around the world teach millions of students on
              StudyNotion. We provide the tools and skills to teach what you
              love.
            </p>
            <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div
                className=" flex flex-row gap-2 
                justify-center items-center"
              >
                Start Teaching Today
                <FaArrowRight></FaArrowRight>
              </div>
            </CTAButton>
            </div>
            
          </div>
    
      </div>
    </div>
  );
}

export default InstructorSection;
