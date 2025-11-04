const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            error: 'Por favor, forneça email e senha'
        });
    }

    db.query('SELECT * FROM usuario WHERE email = ? AND senha = ?', 
        [email, senha], 
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: 'Erro ao fazer login'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    error: 'Email ou senha incorretos'
                });
            }

            res.status(200).json({
                message: 'Login realizado com sucesso',
                user: {
                    id: results[0].id_usuario,
                    nome: results[0].nome,
                    email: results[0].email
                }
            });
        }
    );
});

module.exports = router;