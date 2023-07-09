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
    saveUninitialized: true
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
    if (!req.session.tempUserId) {
      // Generate a temporary user ID using shortid package
      req.session.tempUserId = new ObjectId().toString();
    }

    res.send('Welcome to the landing page!'); // Your landing page HTML here
});

app.get('/dashboard', (req, res) => { 
    console.log(req.session.tempUserId)
    res.send('Welcome to the dashboard!'); // Your dashboard HTML here
});
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/', clicksRouter);
app.use('/', urlRouter)

//error handler
const { errorHandler } = require('./middlewares/error');
app.use(errorHandler);


module.exports = app;
