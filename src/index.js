import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt"
const app = express();
const port = 3000;

const saltRounds = 2;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "quicktrip",
    password: "aman8878",
    port: "5432",
})
db.connect();

// middleware
app.use(bodyParser.json())

// Hello Endpoint
app.get('/quicktrip/hello', (req, res) => {
    res.send('hello');
    
});

// Users Endpoints
app.get('/quicktrip/users', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users");
        const users = result.rows;
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
      }
  });

  app.post('/quicktrip/users-register', async (req, res) => {
    try {
        const newUser = req.body;

        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [newUser.email]);

        if (checkResult.rows.length > 0) {
            res.send("Email already exists. Try logging in.");
        } else {

            const password = newUser.password;

            //password hashing
            bcrypt.hash(password,saltRounds,async (err,hash) =>{

                if(err) {
                    console.errorlog("Error hashing password");
                } else {
                    // Assuming your "users" table has columns: id, user_name, role_, phone_no, email, password, address_id
                const { id, user_name, role_, phone_no, email, password, address_id, package_id} = newUser;

                // Use parameterized queries to prevent SQL injection
                const query = {
                    text: 'INSERT INTO users(id, user_name, role_, phone_no, email, password, address_id, package_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                    values: [id, user_name, role_, phone_no, email, hash, address_id,package_id],
                };

                // Execute the query
                const result = await db.query(query);

                // Respond with the newly inserted user
                res.status(200).json(newUser);

                }
            })   
        }
    } catch (error) {
        console.error('Error inserting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.put("/quicktrip/users/:id", async (req, res) => {
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
});

app.delete("/quicktrip/users/:id", async (req,res) =>{
    try {
        const userId = req.params.id;

        const query = {
            text : 'DELETE from users where id = $1',
            values : [userId],
        };

        await db.query(query);
        res.json("deleted");

    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

//Package Endpoint
app.get("/quicktrip/package", async (req,res) => {
    try{
        const result = await db.query('SELECT * from package');
        const packagee = result.rows;
        res.json(packagee);

    } catch(error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
})

app.post("/quicktrip/package", async (req,res) => {
    try{
        const newPackage = req.body;

        const { package_id, description, photo} = newPackage;
        
        const query = {
            text : 'INSERT into package(package_id,description,photo)VALUES($1, $2, $3) RETURNING *',
            values : [package_id,description,photo],
        }

        const result = await db.query(query);
        res.json(result.rows);

    } catch (error) {
        console.error('Error inserting package:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.put("/quicktrip/package/:packageId", async (req,res) =>{
    try {
            const packageId = req.params.packageId;
            const updatedPackage = req.body;

            const { description, photo} = updatedPackage;

            const query = {
                text : 'UPDATE package set description = $1, photo = $2 WHERE package_id = $3',
                values : [description, photo, packageId],
            }

            const result =await db.query(query);

            if (result.rowCount > 0) {
                // The update was successful
                res.json(updatedPackage);
            } else {
                // No user was updated (user with the given ID not found)
                res.status(404).send('User not found');
            }
    } catch (error) {
        console.error('Error updating package:', error.message);
        res.status(500).send('Internal Server Error');
    }
})

app.delete("/quicktrip/package/:packageId", async (req,res) => {
    try{
        const packageId = req.params.packageId;

        const query = {
            text : 'DELETE FROM package where package_id = $1',
            values : [packageId],
        }
        await db.query(query);
        res.json("deleted");
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
})

app.get("/quicktrip/review", async (req,res) => {
    try {
        const result = await db.query('select * from review');
        res.json(result.rows)  ;     
    } catch (error) {
        console.error("can't get reviews", error.message);
        res.status(500).send('Internal server error');
    }
})

// writing review on package
app.post("/quicktrip/write-review/:userId/:packageId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const packageId = parseInt(req.params.packageId);
        const reviewDesc = req.body.review_desc;

        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const packageResult = await db.query("SELECT * FROM package WHERE package_id = $1", [packageId]);

        if (userResult.rows.length > 0 && packageResult.rows.length > 0) {
            // Insert a new review into the database
            const insertReviewQuery = `
                INSERT INTO review (review_desc, package_id, user_id)
                VALUES ($1, $2, $3)
                RETURNING *;`;

            const values = [reviewDesc, packageId, userId]; // Fix: Use reviewDesc instead of values[0]
            const insertReviewResult = await db.query(insertReviewQuery, values);

            const newReview = insertReviewResult.rows[0];
            res.json(newReview);
        } else {
            res.status(404).send("User or Package not found with provided IDs");
        }
    } catch (error) {
        console.error('Error writing review:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/quicktrip/booking/:userId/:packageId", async (req,res) => {
    try {
        const userId = parseInt(req.params.userId);
        const packageId = parseInt(req.params.packageId);
        const noOfGuests = req.body.no_of_guests;
        const bookingDate = req.body.booking_date;
        console.log("Hello");

        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const packageResult = await db.query("SELECT * FROM package WHERE package_id = $1", [packageId]);
        console.log("aman");
        if (userResult.rows.length > 0 && packageResult.rows.length > 0) {
            // Insert a new review into the database
            const insertBookingQuery = `
                INSERT INTO booking (no_of_guests, booking_date, user_id, package_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`;

            const values = [noOfGuests, bookingDate, userId, packageId]; 
            const insertBookingResult = await db.query(insertBookingQuery, values);
            console.log("para");
            const newBooking = insertBookingResult.rows[0];
            res.json(newBooking);
        } else {
            res.status(404).send("User or Package not found with provided IDs");
        }
    } catch (error) {
        console.error('Error booking:', error.message);
        res.status(500).send('Internal Server Error');
    }

})
  
  app.post("/quicktrip/login", async (req, res) => {
    const email = req.body.email;
    const loginPassword = req.body.password;
  
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        
        bcrypt.compare(loginPassword, storedHashedPassword, (err,result) => {
            if(err) {
                console.log("Error comparing password")
            } else {
                if(result)
                    res.send("WELCOME");
                else
                res.send("Incorrect Password");
            }
        })
      } else {
        res.send("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
////////////////////////////////////////////////