import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';


export const ContactForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
   

    emailjs.sendForm(
      process.env.REACT_APP_SERVICE_ID, // serviceId
      process.env.REACT_APP_TEMPLATE_ID, // templateId
      form.current, // form
      process.env.REACT_APP_PUBLIC_KEY
    )
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <form className="contact-form-container"ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <button className="custom-button" type="submit">
        Send
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"> {/* Adjusted size */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
</button>
    </form>
  );
};