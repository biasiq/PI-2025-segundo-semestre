import express from 'express';
const router = express.Router();

export default function(db) {
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

    router.get('/all', (req, res) => {
        const q = 'SELECT id_materia, nome FROM materia ORDER BY nome';
        db.query(q, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar matérias' });
            }
            res.json(results);
        });
    });

    return router;
};