const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: './.env'});

const app = express();

//seguinte, essas variaveis de acesso são consideradas sensiveis, ent elas estão em um outro arquivo ".env", que tá no gitignore, eu explico mlr dps, mas de qqlr forma elas
//mudam de pc pra pc por causa do mysql, inclusive dps a gnt precisa ver se vai usar a nuvem ou n, pq ai essas coisas vão mudar

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

app.use('/auth', require('./routes/auth'));

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