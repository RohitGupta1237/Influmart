const nodemailer = require("nodemailer");
const Brand = require("../model/brandDbRequestModel");
const OTP = require("../model/otp");
const configs = require("../config/configs");
const { v4: uuidv4 } = require('uuid');
const {
  ERR_SAVE_DATA,
  SUBJECT,
  ERROR,
  INVALID_OTP,
  EXPIRE_OTP,
  VERIFY_OTP,
  DOESNT_EXIST,
  OTP_SENT,
  OTP_NOT_EXPIRED,
  BRAND_ALREADY_EXISTS,
  NAME_ALREADY_EXISTS,
} = require("../constant/constants");

const transporter = nodemailer.createTransport({
  host: configs.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: configs.OTP_MAIL,
    pass: configs.PASSWORD,
  },
});
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTP = async (req, res) => {
  const { email, name } = req.body;

  // Check if email exists
  //Uncomment this only after integrating the brand with database
  let brand = await Brand.findOne({ email });
  let _name = await Brand.findOne({ name });
  if (_name) {
    return res.status(400).json({ message: NAME_ALREADY_EXISTS });
  }
  if (brand) {
    return res.status(400).json({ message: BRAND_ALREADY_EXISTS });
  }
  let _email = await OTP.findOne({ email });
  if (_email) {
    if (Date.now() < _email.otpExpires) {
      return res.status(200).json({ message: OTP_NOT_EXPIRED });
    }
  }
  // Generate OTP
  const otp = generateOTP();
  const otpExpires = Date.now() + 3600000;
  if (_email) {
    try {
      _email.otp = otp;
      _email.otpExpires = otpExpires;
      await _email.save();
    } catch (error) {
      return res.status(500).json({ message: ERR_SAVE_DATA, error: error });
    }
  } else {
    try {
      const newOTP = new OTP({
        email,
        otp,
        otpExpires,
      });
      await newOTP.save();
    } catch (error) {
      return res.status(500).json({ message: ERR_SAVE_DATA, error: error });
    }
  }
  const mailOptions = {
    from: configs.OTP_MAIL,
    to: email,
    subject: SUBJECT,
    text: `Your OTP code is ${otp}. It will expire in 1 hour.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: ERROR, error: error });
    }
    res.status(200).json({ message: OTP_SENT });
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await OTP.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: DOESNT_EXIST });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: INVALID_OTP });
  }

  if (Date.now() > user.otpExpires) {
    return res.status(400).json({ message: EXPIRE_OTP });
  }

  res.status(200).json({ message: VERIFY_OTP });
};


const raiseTicket = (req, res) => {
  const { name, email, subject, description, priority, category } = req.body;
  
  // Generate a unique ticket ID
  const ticketId = uuidv4();

  // Send an email to your office with the ticket details
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: configs.OTP_MAIL,
      pass: configs.PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: 'influmart.social@influmart.in',
    subject: `New Support Ticket: ${subject}`,
    text: `Ticket ID: ${ticketId}\nName: ${name}\nEmail: ${email}\nPriority: ${priority}\nCategory: ${category}\nDescription: ${description}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(201).json({ ticketId });
  });
};

const sendTicket = (req, res) => {
  const { email, ticketId } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: configs.OTP_MAIL,
      pass: configs.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'influmart.social@influmart.in',
    to: email,
    subject: `Your Ticket ID: ${ticketId}`,
    text: `Thank you for raising a ticket. Your Ticket ID is ${ticketId}. We will get back to you soon.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Confirmation email sent');
  });
};


module.exports = { sendOTP, verifyOTP, raiseTicket, sendTicket };
