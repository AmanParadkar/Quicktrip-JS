import bcrypt from "bcrypt";
import db from '../database/db';

export const getAllUsers = async (req, res) => {
    try {
        console.log("Hello");
        // Your logic to fetch all users from the database
        // Sample response
        const result = await db.query("SELECT * FROM users");
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Sample function to register a new user
export const registerUser = async (req, res) => {
    try {
        const newUser = req.body;

        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [newUser.email]);

        if (checkResult.rows.length > 0) {
            res.send("Email already exists. Try logging in.");
        } else {
            const password = newUser.password;

            // Hash password
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password");
                    res.status(500).send('Internal Server Error');
                } else {
                    const { id, user_name, role_, phone_no, email, address_id, package_id } = newUser;

                    // Insert new user
                    const query = {
                        text: 'INSERT INTO users(id, user_name, role_, phone_no, email, password, address_id, package_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                        values: [id, user_name, role_, phone_no, email, hash, address_id, package_id],
                    };

                    const result = await db.query(query);
                    res.json(result.rows[0]);
                }
            });
        }
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Sample function to update a user
export const updateUser = async (req, res) => {
    try {
            const userId = req.params.id;
            const updatedUser = req.body;

            const { user_name, role_, phone_no, email, password, address_id, package_id } = updatedUser;

            const query = {
                text: 'UPDATE users SET user_name = $1, role_ = $2, phone_no = $3, email = $4, password = $5, address_id = $6, package_id = $7 WHERE id = $8',
                values: [user_name, role_, phone_no, email, password, address_id, package_id, userId],
        };

        const result = await db.query(query);

        if (result.rowCount > 0) {
            // The update was successful
            res.json(updatedUser);
        } else {
            // No user was updated (user with the given ID not found)
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Sample function to delete a user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const query = {
            text: 'DELETE from users where id = $1',
            values: [userId],
        };

        await db.query(query);
        res.json("User deleted");
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
};