import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import dotenv from "dotenv";
import { Request, Response } from "express";
// import AppSetting from "../models/AppSetting";
import { queryErrorRelatedResponse, successResponse } from "./sendResponse";

dotenv.config();

interface MailData {
  from: string;
  to: string;
  cc?: string;
  sub: string;
  htmlFile: string;
  extraData: {
    resetLink?: string;
    otp?: string;
    username?: string;
    useremail?: string;
    usermo?: string;
    question?: string;
  };
}

export const sendMail = async (data: MailData, req: Request, res: Response): Promise<void> => {
  try {
    // const mail = await AppSetting.findOne();

    // if (!mail) {
    //   return queryErrorRelatedResponse(res, 500, "Mail configuration not found");
    // }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_host,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    fs.readFile(data.htmlFile, { encoding: "utf-8" }, (err, html) => {
      if (err) {
        return queryErrorRelatedResponse(res, 500, "Error reading email template");
      }

      const template = handlebars.compile(html);
      const replacements = {
        resetLink: data.extraData.resetLink,
        OTP: data.extraData.otp,
        username: data.extraData.username,
        useremail: data.extraData.useremail,
        usermo: data.extraData.usermo,
        question: data.extraData.question,
        copyrighttext: "© 2025 Car Auto Wash. All rights reserved.",
      };
      const htmlToSend = template(replacements);

      const mailOptions = {
        from: data.from,
        to: data.to,
        cc: data.cc,
        subject: data.sub,
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return queryErrorRelatedResponse(res, 500, "Something went wrong");
        } else {
          return successResponse(res, "Check your email");
        }
      });
    });
  } catch (error) {
    return queryErrorRelatedResponse(res, 500, "Internal server error");
  }
};
