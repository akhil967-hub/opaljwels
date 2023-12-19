const User = require("../models/userModel");
const nodeMailer = require("nodemailer");
const argon2 = require('argon2');
require('dotenv').config()




let otp = `${Math.floor(1000 + Math.random() * 9000)}`



const sendmail = (name, email) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.myEmail,
                pass: process.env.myEmailPassword
            },
        });
        const mailoptions = {
            from: "anukthavr@gmail.com",
            to: email,
            cc: "anukthavr@gmail.com",
            subject: "Verification Mail",
            text: `Hello ${name} Your OTP ${otp}`
        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('email has been set' + info.response);
            }
            return otp
        })

    } catch (error) {
        console.log(error.message)
    }
}

const loadforgotpassword = async (req, res) => {
    try {
        res.render('forgotpassword')

    } catch (error) {
        console.log(error.message);
    }
}
const loadforgototp = async (req, res) => {
    try {
        res.render('otpforgotpassword')
    } catch (error) {
        console.log(error.message)
    }
}

// VERIFY EMAIL AND SEND OTP

let email1
const verifymail = async (req, res) => {
    email1 = req.body.email;
    console.log(email1);
    try {
        const user = await User.findOne({ email: email1 }); // Use findOne instead of find
        if (user) {
            console.log('User exists');
            sendmail(user.name, email1); // Pass user name to sendmail
            res.render('otpforgotpassword');
        } else {
            res.render('forgotpassword', { message: 'Email Id not exist' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyforgototp = async (req, res) => {
    const forgototp = req.body.otp
    try {
        if (otp == forgototp) {
            res.render('resetpassword1')
        } else {
            res.render('otpforgotpassword', { message: 'Entered otp wrong' })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadresetpassword = async (req, res) => {
    try {
        res.render('resetpassword1')

    } catch (error) {
        console.log(error.message)
    }
}
// Reset password
const resetpassword = async (req, res) => {
    const newPassword = req.body.password; // Get the new password
    try {
        const hashedPassword = await argon2.hash(newPassword);

        // Update the user's password in the database
        await User.findOneAndUpdate(
            { email: email1 },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadforgotpassword,
    verifymail,
    loadforgototp,
    verifyforgototp,
    loadresetpassword,
    resetpassword

}