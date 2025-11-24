import express from 'express';
const router = express.Router();

export default function (db) {

    router.post('/create', (req, res) => {
        let { nome } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({
                error: 'O nome da matéria deve ter pelo menos 3 caracteres.'
            });
        }

        nome = nome.trim().replace(/[<>]/g, '');

        const qCheck = `SELECT id_materia FROM materia WHERE nome = ? LIMIT 1`;
        db.query(qCheck, [nome], (err, rs) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: 'Erro ao verificar duplicidade.'
                });
            }

            if (rs.length > 0) {
                return res.status(409).json({
                    error: 'Matéria já cadastrada.'
                });
            }

            const qInsert = `INSERT INTO materia (nome) VALUES (?)`;
            db.query(qInsert, [nome], (errIns, rsIns) => {
                if (errIns) {
                    console.error(errIns);

                    if (errIns.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({
                            error: 'Matéria já cadastrada.'
                        });
                    }

                    return res.status(500).json({
                        error: 'Erro ao criar matéria.'
                    });
                }

                return res.status(201).json({
                    message: 'Matéria criada com sucesso.',
                    id_materia: rsIns.insertId
                });
            });
        });
    });

    router.get('/all', (req, res) => {
        db.query('SELECT id_materia, nome FROM materia ORDER BY nome', (err, rs) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar matérias' });
            }
            res.json(rs);
        });
    });

    router.get('/check', (req, res) => {
        const nome = (req.query.nome || '').trim();

        const q = 'SELECT 1 FROM materia WHERE nome = ? LIMIT 1';
        db.query(q, [nome], (err, rs) => {
            if (err) return res.json({ exists: false });
            res.json({ exists: rs.length > 0 });
        });
    });

    return router;
};
