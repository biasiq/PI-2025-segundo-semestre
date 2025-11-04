const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: './.env'});

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//seguinte, essas variaveis de acesso são consideradas sensiveis, ent elas estão em um outro arquivo ".env", que tá no gitignore, eu explico mlr dps, mas de qqlr forma elas
//mudam de pc pra pc por causa do mysql, inclusive dps a gnt precisa ver se vai usar a nuvem ou n, pq ai essas coisas vão mudar

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

try {
    app.use('/auth', require('./routes/auth'));
    console.log('Auth routes loaded successfully');
    app.use('/materias', require('./routes/materias'));
    console.log('Materias routes loaded successfully');
    app.use('/users', require('./routes/users'));
    console.log('Users routes loaded successfully');
} catch (error) {
    console.error('Error loading routes:', error);
}

// Serve static files from the front directory
app.use(express.static('front'));

db.connect((error) => {
    if(error){
        console.log(error)
    }else{
        console.log("MySQL Connected")
    }
})

app.listen(5500, () => {
    console.log("Server started on Port 5500")
})