import express from 'express';
const router = express.Router();

export default function(db) {
    router.post('/create', (req, res) => {
        const { id_materia, nome } = req.body;
        if (!id_materia || !nome) {
            return res.status(400).json({ error: 'id_materia e nome são obrigatórios' });
        }

        db.query('SELECT id_materia FROM materia WHERE id_materia = ?', [id_materia], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao verificar matéria' });
            }
            if (results.length === 0) return res.status(404).json({ error: 'Matéria não encontrada' });

            const q = 'INSERT INTO assunto (id_materia, nome) VALUES (?, ?)';
            db.query(q, [id_materia, nome], (e, r) => {
                if (e) {
                    console.error(e);
                    return res.status(500).json({ error: 'Erro ao criar assunto' });
                }
                res.status(201).json({ message: 'Assunto criado com sucesso', id_assunto: r.insertId });
            });
        });
    });

    router.get('/materia/:id_materia', (req, res) => {
        const { id_materia } = req.params;
        const q = 'SELECT id_assunto, nome FROM assunto WHERE id_materia = ? ORDER BY nome';
        db.query(q, [id_materia], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar assuntos' });
            }
            res.json(results);
        });
    });

    router.get('/all', (req, res) => {
        const q = 'SELECT id_assunto, nome, id_materia FROM assunto ORDER BY nome';
        db.query(q, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar assuntos' });
            }
            res.json(results);
        });
    });

    return router;
};
