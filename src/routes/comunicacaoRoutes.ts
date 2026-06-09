import { Router } from "express";

import { ComunicacaoController } from "../controllers/comunicacaoController.js";

const router = Router();
const comunicacaoController = new ComunicacaoController();

router.post("/inserir", (req, res, next) =>
	comunicacaoController.criar(req, res, next),
);

export default router;
