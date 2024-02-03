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
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
    </form>
  );
};