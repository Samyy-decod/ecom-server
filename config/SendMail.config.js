const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");

module.exports.sendEmail = async ({email,subject, templateData }) => {

    try {
    const Transpoter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        host: process.env.SMPT_HOST,
        port: 587,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        }
    });

    // Define the path to the EJS template
    const templatePath = path.join(__dirname, "../views/emails/resetPassword.ejs");

    // Render the EJS template
    const html = await ejs.renderFile(templatePath, templateData);




    const email_Opctions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: subject,
        html: html,
    };


        await Transpoter.sendMail(email_Opctions);
        console.log("Email sent successfully!");


    } catch (error) {
        console.error("Error sending email:", error);
    }
};
