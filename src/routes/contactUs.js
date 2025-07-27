import express from "express";
import { checkUser, registerNewUser } from "../database/db_auth.js";
import { issueJWT } from "../config/utils.js";
import passport from "passport";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const contactForm = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAILADDRESS,
      pass: process.env.GMAILPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.GMAILADDRESS,
    to: process.env.GMAILADDRESS,
    subject: `Message on TOTAL TOTYM - From: ${contactForm.formMessage.community_name}`,
    text: `Message: ${contactForm.formMessage.contactMessage}, email: ${contactForm.formMessage.email} community_name: ${contactForm.formMessage.community_name}`,
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(mailOptions);

    console.log("Message Sent Succesfully", info.messageId);
    res.status(200).send("Email sent sucessfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending email");
  }
});

export default router;
