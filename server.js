const app = require('./app');
require('dotenv').config();

//connect to database
const { connectDB } = require('./config/connection');
connectDB();




const PORT = process.env.PORT || 4040;

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}.`);
});