const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure this path is correct
const cors = require('cors');
const { corsOptions } = require('./middlewares/cors'); // Ensure this path is correct
// Import routes
const allroutes = require('./routes/indexRoutes');
// Import necessary modules
const app = express();
const cookieParser = require('cookie-parser');


// Load environment variables first
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(cors(corsOptions));

// Database connection
connectDB();

// Routes
app.use('/api', allroutes); 


app.use('/uploads/covers', express.static('uploads/covers'));
app.use('/uploads/contents', express.static('uploads/contents'));
app.use('/uploads/avatars', express.static('uploads/avatars'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});