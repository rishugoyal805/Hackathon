const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require("cors");
app.use(cors());
const cookieParser = require('cookie-parser');
const User = require('./models/user'); // Define the user model
const path = require('path');
const { body, validationResult } = require('express-validator');
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
}));



// Handle User Registration
// app.post('/register', [
//   body('email').isEmail().withMessage('Invalid email format'),
//   body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
//     .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
//     .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
//     .matches(/[0-9]/).withMessage('Password must contain a number')
//     .matches(/[\W]/).withMessage('Password must contain a special character'),
//   body('secret').notEmpty().withMessage('Secret is required')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.render('register', { errors: errors.array() });
//   }

//   const { email, password, secret } = req.body;
  
//   // Check if the email exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.render('register', { errors: [{ msg: 'Email already registered' }] });
//   }

//   // Hash the password and secret
//   const passwordHash = await bcrypt.hash(password, 10);
//   const secretHash = await bcrypt.hash(secret, 10);

//   const newUser = new User({
//     email,
//     password: passwordHash,
//     secret: secretHash,
//   });

//   await newUser.save();
//   res.redirect('/login');
// });

// Handle User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render('login', { error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    req.session.userEmail = user.email;
    return res.redirect('/');
  } else {
    return res.render('login', { error: 'Invalid credentials' });
  }
});

// Handle Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Display the index (home) page
app.get('/', (req, res) => {
    const userEmail = req.session.userEmail || null; // or get it from your user model/auth logic
    res.render('index', { userEmail: userEmail });
});


// Display Login page
// Route for handling login form submission
// Route for rendering login page
app.get('/login', (req, res) => {
    // You can pass an error message if there is an error (e.g., failed login)
    const error = req.session.error || null;  // or set it based on some logic
    res.render('login', { error: error });

    // Clear the error after passing it to avoid showing it again in the next request
    req.session.error = null;
});
// POST route for login
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     // Assume you have some logic to validate email and password
//     const isValid = checkLogin(email, password); // Replace with your actual login logic

//     if (!isValid) {
//         // Pass the error message back to the view
//         req.flash('error', 'Invalid email or password');  // Using flash
//         return res.redirect('/login');
//     }

//     // If login is successful, redirect to the dashboard or homepage
//     req.session.userEmail = email;
//     res.redirect('/');
// });

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          req.flash('error', 'Invalid email or password'); 
          return res.redirect('/login');
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
      }
console.log("this is to ensure we are being redirected.....rhguehvrhnuitbah");
      // Store user session
      req.session.isUser=true;
      req.session.userEmail = email;
      req.session.isAdmin = user.isAdmin || false;
      res.json({ success: true, redirectTo: '/home' }); // Redirect to homepage or dashboard
  } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Server error. Please try again.');
      res.redirect('/login');
  }
  console.log("ththththis is to ensure we are being redirected.....rhguehvrhnuitbah");
});


// Display Registration page
// GET route for registration page
// GET route for the registration page
app.get('/register', (req, res) => {
    // Render register page with an empty errors array initially
    res.render('register', { errors: [] });
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

// POST route for registration with OTP
app.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('secret').notEmpty().withMessage('Please enter a secret'), // Add any other validation you need
], async (req, res) => {
  const errors = validationResult(req);  // Get validation errors
  
  if (!errors.isEmpty()) {
    return res.render('register', { errors: errors.array() });
  }

  const { email, password, secret } = req.body; // Get data from form

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { errors: [{ msg: 'Email already registered' }] });
    }

    // Hash the password and secret
    const passwordHash = await bcrypt.hash(password, 10);
    const secretHash = await bcrypt.hash(secret, 10);

    // Generate OTP
    const otp = generateOtp();

    // Save user to the database without OTP field (otp will be updated later after sending email)
    const newUser = await User.create({
      email,
      password: passwordHash,
      secret: secretHash,
      otp: otp,  // Temporary store OTP here
    });

    // await newUser.save();

    console.log("Generated OTP:", otp); // Optional: For debugging

    // Configure the transporter for nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server
      port: 587, // 587 for TLS, 465 for SSL
      secure: false, // true for SSL
      auth: {
        user: "devyani04sh@gmail.com", // Sender email
        pass: "qqqy oeqq jdbr yyql", // App password (not real email password)
      },
    });

    // Email options
    const mailOptions = {
      from: "devyani04sh@gmail.com", // Sender email
      to: email, // Recipient email
      subject: "Your OTP Code",
      text: `Hello, your OTP code is: ${otp}`, // Message with the OTP
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).send("Error sending OTP email");
      } else {
        console.log("OTP sent:", info.response);
        res.redirect('/verify-otp?email=' + encodeURIComponent(email)); // Pass email for verification
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error during registration");
  }
});



// Route for OTP verification
// Route for OTP verification
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;  

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("verify-otp", { email, error: "User not found" });
    }

    if (user.otp && user.otp.toString() === otp) {
      user.otpVerified = true;
      user.otp = null; // Clear OTP after verification
      await user.save();
      res.send("OTP verified successfully! You can now log in.");
    } else {
      res.render("verify-otp", { email, error: "Invalid OTP. Try again." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error verifying OTP");
  }
});


// Route for OTP verification page (GET request)
app.get('/verify-otp', (req, res) => {
  res.render('verify-otp', { email: req.query.email, error: null }); // Pass email to view
});

app.get('/toknow',async (req,res)=>{
   const users = await User.find();
   res.json(users);
});
app.get("/todelete", async (req, res) => {
    try {
      // Specify the email to delete
      const emailToDelete = "devyanisharmaa15@gmail.com";
  
      // Find and delete the user by email
      const deletedUser = await User.findOneAndDelete({ email: emailToDelete });
  
      if (deletedUser) {
        res.send("User deleted successfully");
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal server error");
    }
  });
  

app.listen(3000);