import { Router } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';
import { EscolaController } from '../controllers/EscolaController';
import { CargaHorariaController } from '../controllers/CargaHorariaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();
const professorController = new ProfessorController();
const escolaController = new EscolaController();
const cargaHorariaController = new CargaHorariaController();

// ─────────────────────────────────────────
// ROTAS PÚBLICAS (sem autenticação)
// ─────────────────────────────────────────
router.post('/register', (req, res) => professorController.register(req, res));
router.post('/login', (req, res) => professorController.login(req, res));

// ─────────────────────────────────────────
// ROTAS PROTEGIDAS (requerem JWT Bearer)
// ─────────────────────────────────────────
router.use(authMiddleware);

// Professor — perfil do professor autenticado
router.get('/professores/me', (req, res) => professorController.profile(req, res));
router.put('/professores/me', (req, res) => professorController.update(req, res));
router.delete('/professores/me', (req, res) => professorController.delete(req, res));

// Escola — CRUD completo
router.post('/escolas', (req, res) => escolaController.create(req, res));
router.get('/escolas', (req, res) => escolaController.list(req, res));
router.get('/escolas/:id', (req, res) => escolaController.show(req, res));
router.put('/escolas/:id', (req, res) => escolaController.update(req, res));
router.delete('/escolas/:id', (req, res) => escolaController.delete(req, res));

// Carga Horária — CRUD completo
router.post('/cargas', (req, res) => cargaHorariaController.create(req, res));
router.get('/cargas', (req, res) => cargaHorariaController.list(req, res));
router.get('/cargas/:id', (req, res) => cargaHorariaController.show(req, res));
router.put('/cargas/:id', (req, res) => cargaHorariaController.update(req, res));
router.delete('/cargas/:id', (req, res) => cargaHorariaController.delete(req, res));

export default router;
