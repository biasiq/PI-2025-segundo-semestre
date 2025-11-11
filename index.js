import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

dotenv.config({ path: './.env'});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionOptions = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
};

if (process.env.DATABASE_PORT) connectionOptions.port = Number(process.env.DATABASE_PORT);

if (process.env.DATABASE_SSL && process.env.DATABASE_SSL.toLowerCase() === 'true') {
    if (process.env.DATABASE_SSL_CA_PATH) {
        try {
            const ca = fs.readFileSync(process.env.DATABASE_SSL_CA_PATH, 'utf8');
            connectionOptions.ssl = { ca };
        } catch (err) {
            console.error('Failed to read DATABASE_SSL_CA_PATH:', err.message);
            connectionOptions.ssl = { rejectUnauthorized: false };
        }
    } else {
        connectionOptions.ssl = { rejectUnauthorized: false };
    }
}

const db = mysql.createConnection(connectionOptions);

try {
    const authRoutes = (await import('./routes/auth.js')).default;
    app.use('/auth', authRoutes(db));
    console.log('Auth routes loaded successfully');

    const materiasRoutes = (await import('./routes/materias.js')).default;
    app.use('/materias', materiasRoutes(db));
    console.log('Materias routes loaded successfully');

    const assuntosRoutes = (await import('./routes/assuntos.js')).default;
    app.use('/assuntos', assuntosRoutes(db));
    console.log('Assuntos routes loaded successfully');

    const usersRoutes = (await import('./routes/users.js')).default;
    app.use('/users', usersRoutes(db));
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