import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

export default function(db) {
    router.post('/login', (req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                error: 'Por favor, forneça email e senha'
            });
        }

        db.query('SELECT * FROM usuario WHERE email = ?', [email], async (error, results) => {
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

            const user = results[0];
            const senhaConfere = await bcrypt.compare(senha, user.senha);

            if (!senhaConfere) {
                return res.status(401).json({
                    error: 'Email ou senha incorretos'
                });
            }

            res.status(200).json({
                message: 'Login realizado com sucesso',
                user: {
                    id: user.id_usuario,
                    nome: user.nome,
                    email: user.email
                }
            });
        });
    });

    return router;
};
