const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/create', (req, res) => {
    const { nome, descricao, professor } = req.body;

    if (!nome || !professor) {
        return res.status(400).json({
            error: 'Nome e professor são campos obrigatórios'
        });
    }

    const query = 'INSERT INTO materias (nome, descricao, professor) VALUES (?, ?, ?)';
    
    db.query(query, [nome, descricao, professor], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: 'Erro ao criar matéria'
            });
        }

        res.status(201).json({
            message: 'Matéria criada com sucesso',
            id: results.insertId
        });
    });
});

module.exports = router;