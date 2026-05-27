import { Router } from "express";

import { UnidadeController } from "../controllers/unidadeController.js";

const router = Router();
const unidadeController = new UnidadeController();

router.get("/listar", (req, res) => unidadeController.listar(req, res));
router.get("/obterPorId/:id", (req, res) =>
  unidadeController.buscarPorId(req, res),
);
router.get("/listarComunicacoes/:id", (req, res) =>
  unidadeController.listarComunicacoes(req, res),
);

export default router;
