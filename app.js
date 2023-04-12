const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "sqlinsta.db");

let db = null;


const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(4000, () => {
            console.log("Server Running at http://localhost:4000/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();


//Create User API
// Add a new user to the database
const saltRounds = 10;

app.post("/api/register", async (request, response) => {
    const { username, email, password } = request.body;
    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : null;
    const selectUserQuery = `
        SELECT 
            *
        FROM
            users
        WHERE
        username = '${username}';
    `;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        const createUserQuery = `
        INSERT INTO
            users (username,email,password)
        VALUES
            (     
            '${username}',
            '${email}',          
            '${hashedPassword}'
            );`;
        await db.run(createUserQuery);
        response.send("User created Successfully");
    } else {
        response.status(400);
        response.send("Username already exists");
    }
});


//User Login API

app.post("/api/login", async (request, response) => {
    const { username, password } = request.body;
    const selectUserQuery = `
        SELECT 
            *
        FROM
            users
        WHERE
        username = '${username}';
    `;
    const dbUser = await db.get(selectUserQuery);

    if (dbUser === undefined) {
        response.status(400);
        response.send("User doesn't exist");
    } else {

        //compare password, hashed password
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if (isPasswordMatched) {
            // generate JWT token with user ID as payload
            const token = jwt.sign({ id: dbUser.id }, 'my-secret-key', { expiresIn: '1h' });
            response.json({ token: token });
        } else {
            response.status(400);
            response.send("Invalid Password");
        }
    }
});


// const express = require("express");
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const path = require("path");
// const { open } = require("sqlite");
// const sqlite3 = require('sqlite3').verbose();
// const bcrypt = require("bcrypt");
// const cors = require("cors");

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.json());

// const dbPath = path.join(__dirname, "sqlinsta.db");

// let db = null;

// const initializeDBAndServer = async () => {
//     try {
//         db = await open({
//             filename: dbPath,
//             driver: sqlite3.Database,
//         });
//         app.listen(4000, () => {
//             console.log("Server Running at http://localhost:4000/");
//         });
//     } catch (e) {
//         console.log(`DB Error: ${e.message}`);
//         process.exit(1);
//     }
// };

// initializeDBAndServer();


// //Create User API
// // Add a new user to the database
// const saltRounds = 10;

// app.post("/api/register", async (request, response) => {
//     const { username, email, password } = request.body;
//     const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : null;
//     const selectUserQuery = `
//         SELECT 
//             *
//         FROM
//             users
//         WHERE
//             username = ${username}';
//     `;
//     const dbUser = await db.run(selectUserQuery);
//     if (dbUser === undefined) {
//         const createUserQuery = `
//             INSERT INTO
//                 users (username,email,password)
//             VALUES
//             (     
//                 '${username}',
//                 '${email}',          
//                 '${hashedPassword}'
//             );
//         `;
//         await db.run(createUserQuery);
//         response.send("User created Successfully");
//     } else {
//         response.status(400);
//         response.send("Username already exists");
//     }
// });


// //User Login API
// app.post("/api/login", async (request, response) => {
//     const { username, password } = request.body;
//     const selectUserQuery = `
//         SELECT 
//             *
//         FROM
//             users
//         WHERE
//             username = '${username}';
//     `;
//     const dbUser = await db.run(selectUserQuery);
//     console.log(dbUser);

//     if (dbUser === undefined) {
//         response.status(400);
//         response.send("User doesn't exist");
//     } else {
//         //compare password, hashed password
//         const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
//         if (isPasswordMatched) {
//             // generate JWT token with user ID as payload
//             const token = jwt.sign({ id: dbUser.id }, 'my-secret-key', { expiresIn: '1h' });
//             response.json({ token: token });
//         } else {
//             response.status(400);
//             response.send("Invalid Password");
//         }
//     }
// });






















// // const sqlite3 = require('sqlite3').verbose();

// // // open the database connection
// // const db = new sqlite3.Database('sqlinsta.db');

// // // create the user table
// // db.run(`CREATE TABLE IF NOT EXISTS users (
// //   id INTEGER PRIMARY KEY AUTOINCREMENT,
// //   name TEXT NOT NULL,
// //   email TEXT NOT NULL UNIQUE,
// //   password TEXT NOT NULL,
// //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // )`);

// // // close the database connection
// // db.close();
