import express from 'express';
const router = express.Router();

export default function (db) {

    router.post('/create', (req, res) => {
        let { id_materia, nome } = req.body;

        if (!id_materia || !nome) {
            return res.status(400).json({ error: 'id_materia e nome são obrigatórios.' });
        }

        id_materia = Number(id_materia);
        nome = nome.trim().replace(/[<>]/g, '');

        if (nome.length < 3) {
            return res.status(400).json({ error: 'Nome do assunto precisa de 3+ caracteres.' });
        }

        const qMat = 'SELECT id_materia FROM materia WHERE id_materia = ? LIMIT 1';
        db.query(qMat, [id_materia], (errMat, rsMat) => {
            if (errMat) {
                return res.status(500).json({ error: 'Erro ao validar matéria.' });
            }
            if (rsMat.length === 0) {
                return res.status(404).json({ error: 'Matéria não encontrada.' });
            }

            const qDup =
                'SELECT 1 FROM assunto WHERE id_materia = ? AND nome = ? LIMIT 1';
            db.query(qDup, [id_materia, nome], (errDup, rsDup) => {
                if (errDup) {
                    return res.status(500).json({ error: 'Erro ao verificar assunto.' });
                }
                if (rsDup.length > 0) {
                    return res.status(409).json({
                        error: 'Assunto já cadastrado para essa matéria.'
                    });
                }

                const qInsert =
                    'INSERT INTO assunto (id_materia, nome) VALUES (?, ?)';
                db.query(qInsert, [id_materia, nome], (errIns, rsIns) => {
                    if (errIns) {
                        if (errIns.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({
                                error: 'Assunto já cadastrado.'
                            });
                        }
                        return res.status(500).json({
                            error: 'Erro ao criar assunto.'
                        });
                    }

                    return res.status(201).json({
                        message: 'Assunto criado com sucesso.',
                        id_assunto: rsIns.insertId
                    });
                });
            });
        });
    });

    router.get('/all', (req, res) => {
        const q = `SELECT id_assunto, nome, id_materia FROM assunto ORDER BY nome`;
        db.query(q, (err, rs) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar assuntos' });
            res.json(rs);
        });
    });

    router.get('/materia/:id_materia', (req, res) => {
        const id_materia = req.params.id_materia;
        const q =
            `SELECT id_assunto, nome 
             FROM assunto
             WHERE id_materia = ?
             ORDER BY nome`;

        db.query(q, [id_materia], (err, rs) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar assuntos' });
            res.json(rs);
        });
    });

    return router;
};
