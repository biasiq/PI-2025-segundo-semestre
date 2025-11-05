const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: './.env'});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

try {
    app.use('/auth', require('./routes/auth')(db));
    console.log('Auth routes loaded successfully');
    app.use('/materias', require('./routes/materias')(db));
    console.log('Materias routes loaded successfully');
    app.use('/users', require('./routes/users')(db));
    console.log('Users routes loaded successfully');
} catch (error) {
    console.error('Error loading routes:', error);
}

app.use(express.static('front'));

db.connect((error) => {
    if(error){
        console.log(error)
    }else{
        console.log("MySQL Connected")
    }
})

app.listen(3000, () => {
    console.log("Server started on Port 3000")
})