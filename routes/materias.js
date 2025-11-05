const express = require('express');
const router = express.Router();

//esse arquivo mudou mto pq eu tinha me baseado na tabela de outro bd, mas agr ta certo (eu acho)

module.exports = function(db) {
    router.post('/create', (req, res) => {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                error: 'Nome é obrigatório'
            });
        }

        const query = 'INSERT INTO materia (nome) VALUES (?)';

        db.query(query, [nome], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: 'Erro ao criar matéria'
                });
            }

            res.status(201).json({
                message: 'Matéria criada com sucesso',
                id_materia: results.insertId
            });
        });
    });

    return router;
};