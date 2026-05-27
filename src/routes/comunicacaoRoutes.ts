import { Router } from "express";

import { ComunicacaoController } from "../controllers/comunicacaoController.js";

const router = Router();
const comunicacaoController = new ComunicacaoController();

router.post("/inserir", (req, res) => comunicacaoController.criar(req, res));

export default router;
