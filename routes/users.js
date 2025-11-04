const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    //validação
    if (!nome || !email || !senha) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios'
        });
    }

    db.query('SELECT email FROM usuario WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Erro ao verificar email'
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                error: 'Este email já está cadastrado'
            });
        }

        const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
        
        db.query(query, [nome, email, senha], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: 'Erro ao criar usuário'
                });
            }

            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                id_usuario: results.insertId
            });
        });
    });
});

module.exports = router;