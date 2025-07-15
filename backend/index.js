const express = require('express');
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = 4000;

const cors = require('cors');

app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));


const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASEURL, {
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000,
    maxPoolSize: 50
}).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});

app.get('/', (req, res) => {
    return res.json('App Is Run')
})


app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/bookingRoutes'))
app.use('/', require('./routes/clientRoutes'))
app.use('/', require("./routes/dashboardRoutes"));
app.use('/', require("./routes/availabilitySettingsRoutes"));
app.use('/', require("./routes/paymentSettingsRoutes"));
app.use('/', require("./routes/notificationsRoutes"));
app.use('/', require("./routes/emailSettingsRoutes"));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
