const express = require("express");
const mongoose = require("mongoose");
const {UserModel} = require("../model/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");



userRouter.get("/", async(req,res)=>{
    console.log({msg: "Welcome"});
    res.send({msg: "Home Page"});
});

// For Email Verification

userRouter.post("/emailVerify", async (req, res) => {
    let {email} = req.body;
    const isPresent = await UserModel.findOne({ email });
    if (isPresent) {
      return res.status(500).send({
        msg: "You are already registered. Please login!",
      });
    }  
  
  
    otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
  
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harsad9799@gmail.com",
        pass: "Haroon@123",
      },
    });
  
    const mailOptions = {
      from: "harsad9799@gmail.com",
      to: email,
      subject: "Here is your OTP for ChatApp Login",
      html: `  <!DOCTYPE html>
          <html>
            <head>
              <title>Example Email Template</title>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #333; padding: 20px;">
              <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; border-collapse: collapse;">
                <tr>
                  <td style="background-color: #0077c0; text-align: center; padding: 10px;">
                    <h1 style="font-size: 28px; color: #fff; margin: 0;">ChatApp</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="font-size: 24px; color: #0077c0; margin-top: 0;">OTP for VetCare Login : ${otp}</h2>
                    <p style="margin-bottom: 20px;">Thank you for choosing VetCare Services</p>
                    <p style="margin-bottom: 0;">Best regards,</p>
                    <p style="margin-bottom: 20px;">ChatApp</p>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
    };
  
    transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.log(info.response);
        res.send({ msg: "Mail has been Send", otp, email });
      })
      .catch((e) => {
        console.log(e);
        res.send(e);
      });
  });



  // For Registration

  userRouter.post("/signup", async (req, res) => {
    let { first_name, last_name, email, mobile, password } = req.body;
    const isPresent = await UserModel.findOne({ email });
    if (isPresent) {
      return res.status(500).send({
        msg: "User already registered",
      });
    }
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).send({ msg: "Error" });
        } else {
          const user = new UserModel({
            first_name,
            last_name,
            email,
            mobile,
            password: hash,
          });
          await user.save();
          res.status(201).send({ msg: " Signup Successfull" });
        }
      });
    } catch (error) {
      res.status(500).send({
        msg: "Error",
      });
    }
  });

module.exports = {userRouter};