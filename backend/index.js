const express = require('express');
const app = express();
app.use(express.json());

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
mongoose.connect(process.env.DATABASEURL).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});


app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/clientRoutes'))
app.use('/', require('./routes/bookingRoutes'))
app.use('/', require("./routes/dashboardRoutes"));
app.use('/', require("./routes/availabilitySettingsRoutes"));
app.use('/', require("./routes/paymentSettingsRoutes"));
app.use('/', require("./routes/notificationsRoutes"));

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





// ---

// ### 🔐 **Auth Pages**

// 1. **Login Page**
//    Trainer logs into their account.

// 2. **Register Page**
//    New trainer signs up.

// ---

// ### 🏠 **Main App Pages (Trainer Dashboard)**

// 3. **Dashboard Page**
//    Overview of upcoming bookings, stats, quick links.

// 4. **Calendar Page**
//    View and manage bookings using a calendar interface.

// 5. **Clients Page**
//    List of all clients with search/filter options.

// 6. **Client Details Page**
//    View client profile, session history, and notes.

// 7. **Add/Edit Client Page**
//    Form to add or edit a client’s info and notes.

// ---

// ### 📅 **Bookings Pages**

// 8. **Bookings List Page**
//    List of all bookings (past, upcoming, cancelled).

// 9. **Add Booking Page**
//    Form to manually add a new booking.

// ---

// ### ⚙️ **Settings Pages**

// 10. **Availability Settings Page**
//     Set available days and hours for booking.

// 11. **Profile Settings Page**
//     Edit trainer's name, email, password, timezone, etc.

// 12. **EmailSettings Page** *(optional)*
//     Configure reminder emails (timing, template, etc.)

// 13. **PaymentSettings Page** *(optional)*
//     Connect Stripe/PayPal and set session pricing.

// ---

// ### 🛠️ **Other Pages**

// 14. **404Page**
//     Page not found handler.

// 15. **Loading/Spinner Page**
//     While fetching data or authenticating.

// ---

