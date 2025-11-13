import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // npm install node-fetch

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
console.log("Chave carregada?", HUGGINGFACE_API_KEY ? "Sim" : "Não");

app.post("/gerar-imagem", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro da API: ${error}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    res.json({ url: `data:image/png;base64,${base64Image}` });
  } catch (erro) {
    console.error("Erro no endpoint /gerar-imagem:", erro);
    res.status(500).json({ error: "Erro ao gerar imagem." });
  }
});

app.listen(3000, () =>
  console.log("✅ Servidor rodando em http://localhost:3000")
);
