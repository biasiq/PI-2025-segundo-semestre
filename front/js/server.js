import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // <---- carrega o arquivo .env

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gerar-imagem", async (req, res) => {
  try {
    const { prompt } = req.body;

    const resultado = await client.images.generate({
        model: "dall-e-3",      // certifique-se que usa o modelo correto
        prompt: prompt,
        size: "1024x1024",      // aqui use um valor válido
      });
      

    res.json({ url: resultado.data[0].url });
  } catch (erro) {
    console.error('Erro no endpoint /gerar-imagem:', erro);
    res.status(500).json({ error: "Erro ao gerar imagem." });
  }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
