//const db = require('../db'); // Assuming db is your database connection
import db from '../database/db';
import bcrypt from "bcrypt";

// User login
const loginUser = async (req, res) => {
    const email = req.body.email;
    const loginPassword = req.body.password;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashedPassword = user.password;

            // Compare passwords
            bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    if (result) {
                        res.send("WELCOME"); // Successful login
                    } else {
                        res.send("Incorrect Password"); // Incorrect password
                    }
                }
            });
        } else {
            res.send("User not found"); // User not found
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    loginUser
};