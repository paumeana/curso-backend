import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import taskRouter from "./src/routes/tasksRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import connectDb from "./src/config/mongodb.js";
import authMiddleware from "./src/middlewares/authMiddleware.js"

dotenv.config()

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;

const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFileName = `access-${new Date().toISOString().split("T")[0]}.log`;
const logFilePath = path.join(logsDir, logFileName);
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS",
    stream: accessLogStream
  })
);

app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS"
  })
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;

  if (dbState !== 1) {
    return res.status(503).json({
      status: "DOWN",
      message: "La base de datos no está conectada",
      dbStatus: dbState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  res.status(200).json({
    status: "OK",
    message: "Sistema operativo y base de datos funcionando correctamente",
    dbStatus: dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRouter)
app.use("/tasks", authMiddleware, taskRouter)

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

if (NODE_ENV !== "test") {
  // Iniciar servidor
  app.listen(PORT, () => {
    connectDb(MONGO_URI);
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
}


export default app
