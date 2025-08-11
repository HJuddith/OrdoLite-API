import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { PrescriptionController } from '../controllers/prescription.controller.js';
import { LineController } from '../controllers/line.controller.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Lister toutes mes prescriptions
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 */
router.get('/', PrescriptionController.listMine);

/**
 * @openapi
 * /prescriptions:
 *   post:
 *     tags: [Prescriptions]
 *     summary: Créer une nouvelle prescription
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionCreateRequest'
 *     responses:
 *       201:
 *         description: Prescription créée
 */
router.post('/', PrescriptionController.create);

/**
 * @openapi
 * /prescriptions/{id}:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Récupérer une prescription par ID
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Prescription trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription introuvable
 */
router.get('/:id', PrescriptionController.get);

/**
 * @openapi
 * /prescriptions/{id}:
 *   put:
 *     tags: [Prescriptions]
 *     summary: Mettre à jour une prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionUpdateRequest'
 *     responses:
 *       200:
 *         description: Prescription mise à jour
 *       404:
 *         description: Prescription introuvable
 */
router.put('/:id', PrescriptionController.update);

/**
 * @openapi
 * /prescriptions/{id}:
 *   delete:
 *     tags: [Prescriptions]
 *     summary: Supprimer une prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Prescription supprimée
 *       404:
 *         description: Prescription introuvable
 */
router.delete('/:id', PrescriptionController.remove);

/**
 * @openapi
 * /prescriptions/{id}/lines:
 *   get:
 *     tags: [Lines]
 *     summary: Lister les lignes d'une prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des lignes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PrescriptionLine'
 *       404:
 *         description: Prescription introuvable
 */
router.get('/:id/lines', LineController.list);

/**
 * @openapi
 * /prescriptions/{id}/lines:
 *   post:
 *     tags: [Lines]
 *     summary: Ajouter une ligne à une prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionLineCreateRequest'
 *     responses:
 *       201:
 *         description: Ligne créée
 *       404:
 *         description: Prescription introuvable
 */
router.post('/:id/lines', LineController.create);

/**
 * @openapi
 * /prescriptions/lines/{lineId}:
 *   put:
 *     tags: [Lines]
 *     summary: Mettre à jour une ligne de prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionLineUpdateRequest'
 *     responses:
 *       200:
 *         description: Ligne mise à jour
 *       404:
 *         description: Ligne introuvable
 */
router.put('/lines/:lineId', LineController.update);

/**
 * @openapi
 * /prescriptions/lines/{lineId}:
 *   delete:
 *     tags: [Lines]
 *     summary: Supprimer une ligne de prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Ligne supprimée
 *       404:
 *         description: Ligne introuvable
 */
router.delete('/lines/:lineId', LineController.remove);

export default router;
