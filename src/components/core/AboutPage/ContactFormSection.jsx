import React from "react";

import ContactUsForm from "../../ContactPage/ContactUsForm";


const ContactFormSection = () => {
  return (
    <div className="mx-auto">
      <h1 className="text-center text-4xl font-semibold  
      bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text ">Get in Touch</h1>
      <p className="text-center text-richblack-300 mt-3">
        We`d love to here for you, Please fill out this form.
      </p>
      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;

