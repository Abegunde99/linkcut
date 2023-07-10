const express = require('express');
require('dotenv').config();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { cacheMiddleware } = require('./utils/redis');
const session = require('express-session');
const shortid = require('shortid');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const clicksRouter = require('./routes/clicks');
const urlRouter = require('./routes/url');


const app = express();

// Initialize session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     secure: true, // Set to true if using HTTPS
    //     httpOnly: true,
    //     sameSite: 'strict' // Adjust based on your requirements
    //   }
}));
  

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());


//routes
app.get('/', (req, res) => {
    // Check if a temporary user ID is already stored in the session
    if (!req.session.userId) {
        // Generate a temporary user ID using shortid package
        req.session.userId = new ObjectId().toString();
    }

    //create a session id and save it in local storage
    // const sessionId = new ObjectId().toString();
    // localStorage.setItem('sessionId', sessionId);
    //store in cookie
    // res.cookie('sessionId', sessionId,{
    //     secure: true, // Set to true if using HTTPS
    //     httpOnly: true,
    //     sameSite: 'strict', // Adjust based on your requirements
    //     maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (e.g., 1 day)
    //   });

    // console.log(req.session.tempUserId)

    res.status(200).json({
       message : 'Welcome to the landing page!'});
});


app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/', clicksRouter);
app.use('/', urlRouter)

//error handler
const { errorHandler } = require('./middlewares/error');
app.use(errorHandler);


module.exports = app;
