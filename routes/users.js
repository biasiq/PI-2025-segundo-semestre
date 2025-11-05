const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

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
    
    return router;
};