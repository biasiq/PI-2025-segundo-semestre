
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 💾 CONFIG DO BANCO DE DADOS ===
const connectionOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
};

if (process.env.DATABASE_PORT) connectionOptions.port = Number(process.env.DATABASE_PORT);

if (process.env.DATABASE_SSL && process.env.DATABASE_SSL.toLowerCase() === "true") {
  if (process.env.DATABASE_SSL_CA_PATH) {
    try {
      const ca = fs.readFileSync(process.env.DATABASE_SSL_CA_PATH, "utf8");
      connectionOptions.ssl = { ca };
    } catch (err) {
      console.error("Failed to read DATABASE_SSL_CA_PATH:", err.message);
      connectionOptions.ssl = { rejectUnauthorized: false };
    }
  } else {
    connectionOptions.ssl = { rejectUnauthorized: false };
  }
}

const db = mysql.createConnection(connectionOptions);

// === 🔗 ROTAS DO SISTEMA ===
try {
  const authRoutes = (await import("./routes/auth.js")).default;
  app.use("/auth", authRoutes(db));

  const materiasRoutes = (await import("./routes/materias.js")).default;
  app.use("/materias", materiasRoutes(db));

  const assuntosRoutes = (await import("./routes/assuntos.js")).default;
  app.use("/assuntos", assuntosRoutes(db));

  const usersRoutes = (await import("./routes/users.js")).default;
  app.use("/users", usersRoutes(db));

  console.log("✅ Rotas do sistema carregadas com sucesso!");
} catch (error) {
  console.error("❌ Erro ao carregar rotas:", error);
}

// === 🧠 ROTA HUGGING FACE ===
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
console.log("🔑 Chave carregada?", HUGGINGFACE_API_KEY ? "Sim" : "Não");

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
    res.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (erro) {
    console.error("❌ Erro no endpoint /gerar-imagem:", erro);
    res.status(500).json({ error: "Erro ao gerar imagem." });
  }
});

// === 🌐 FRONT-END ===
app.use(express.static("front"));

// === 🗄️ CONEXÃO COM BANCO ===
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// === 🚀 SERVIDOR ===
app.listen(3000, () => {
  console.log("✅ Servidor rodando em http://localhost:3000");
});
