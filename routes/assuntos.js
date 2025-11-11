import express from 'express';
const router = express.Router();

export default function(db) {
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
