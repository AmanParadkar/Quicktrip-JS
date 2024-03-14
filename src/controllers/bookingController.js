//const db = require('../db'); // Assuming db is your database connection
import db from '../database/db';
// Book a package
const bookPackage = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const packageId = parseInt(req.params.packageId);
        const noOfGuests = req.body.no_of_guests;
        const bookingDate = req.body.booking_date;

        // Check if user and package exist
        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const packageResult = await db.query("SELECT * FROM package WHERE package_id = $1", [packageId]);

        if (userResult.rows.length > 0 && packageResult.rows.length > 0) {
            // Insert a new booking into the database
            const insertBookingQuery = `
                INSERT INTO booking (no_of_guests, booking_date, user_id, package_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`;

            const values = [noOfGuests, bookingDate, userId, packageId];
            const insertBookingResult = await db.query(insertBookingQuery, values);

            const newBooking = insertBookingResult.rows[0];
            res.json(newBooking);
        } else {
            res.status(404).send("User or Package not found with provided IDs");
        }
    } catch (error) {
        console.error('Error booking:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    bookPackage
};