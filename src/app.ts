import express from "express";
import cors from "cors";

import unidadeRoutes from "./routes/unidadeRoutes.js";
import comunicacaoRoutes from "./routes/comunicacaoRoutes.js";
import { erroMiddleware } from "./middlewares/erroMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/unidades", unidadeRoutes);
app.use("/api/comunicacoes", comunicacaoRoutes);
app.use(erroMiddleware);

export default app;
