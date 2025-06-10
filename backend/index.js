const express = require('express');
const app = express();
app.use(express.json());

const PORT = 4000;

const cors = require('cors');
app.use(cors({}));


const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASEURL).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});


app.use('/', require('./routes/authRoutes'))

app.get('/', (req, res) => {
    return res.json('App Is Run')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// server/
// ├── models/
// │   ├── User.js
// │   ├── Client.js
// │   └── Booking.js
// ├── routes/
// │   ├── authRoutes.js
// │   ├── clientRoutes.js
// │   └── bookingRoutes.js
// ├── controllers/
// │   ├── authController.js
// │   ├── clientController.js
// │   └── bookingController.js
// ├── middleware/
// │   ├── auth.js
// ├── index.js
