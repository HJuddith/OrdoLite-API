import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { MedicationController } from '../controllers/medication.controller.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /medications:
 *   get:
 *     tags: [Medications]
 *     summary: Liste tous les médicaments de l'utilisateur connecté
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des médicaments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medication'
 */
router.get('/', MedicationController.list);

/**
 * @openapi
 * /medications:
 *   post:
 *     tags: [Medications]
 *     summary: Créer un nouveau médicament
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationCreateRequest'
 *     responses:
 *       201:
 *         description: Médicament créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       400:
 *         description: Données invalides
 */
router.post('/', MedicationController.create);

/**
 * @openapi
 * /medications/{id}:
 *   put:
 *     tags: [Medications]
 *     summary: Mettre à jour un médicament existant
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
 *             $ref: '#/components/schemas/MedicationUpdateRequest'
 *     responses:
 *       200:
 *         description: Médicament mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       404:
 *         description: Médicament introuvable
 */
router.put('/:id', MedicationController.update);

/**
 * @openapi
 * /medications/{id}:
 *   delete:
 *     tags: [Medications]
 *     summary: Supprimer un médicament
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Médicament supprimé
 *       404:
 *         description: Médicament introuvable
 */
router.delete('/:id', MedicationController.remove);

export default router;
