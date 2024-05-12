import React from "react";
import ContactUsForm from "./ContactUsForm";
import HighlightText from "../core/HomePage/HighlightText";

function ContactForm() {
  return (
    <div>
      <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
        Got a 
        {" "}
        <HighlightText text={"Idea?"} />
        {" "}
        
        We&apos;ve got the 
        {" "}
        <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-semibold">
        skills.
        </span>
        {" "}
        Let&apos;s team up
      </h1>
      <p className="">
        Tell us more about yourself and what you&apos;re got in mind.
      </p>
      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
}

export default ContactForm;
