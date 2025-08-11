import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { MedicationController } from '../controllers/medication.controller.js';
import { medicationCreateSchema, medicationUpdateSchema } from '../schemas/medication.schema.js';
import { idSchema } from '../schemas/common.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /api/v1/medications:
 *   get:
 *     tags: [Medications]
 *     summary: List all medications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of medications
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
 * /api/v1/medications:
 *   post:
 *     tags: [Medications]
 *     summary: Create a new medication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationCreateRequest'
 *     responses:
 *       201:
 *         description: Medication successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       400:
 *         description: Invalid request data
 */
router.post('/', validate(medicationCreateSchema, 'body'), MedicationController.create);

/**
 * @openapi
 * /api/v1/medications/{id}:
 *   put:
 *     tags: [Medications]
 *     summary: Update an existing medication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the medication to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationUpdateRequest'
 *     responses:
 *       200:
 *         description: Medication successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       404:
 *         description: Medication not found
 */
router.put('/:id', validate(idSchema, 'params'), validate(medicationUpdateSchema, 'body'), MedicationController.update);

/**
 * @openapi
 * /api/v1/medications/{id}:
 *   delete:
 *     tags: [Medications]
 *     summary: Delete a medication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the medication to delete.
 *     responses:
 *       204:
 *         description: Medication successfully deleted
 *       404:
 *         description: Medication not found
 */
router.delete('/:id', validate(idSchema, 'params'), MedicationController.remove);

export default router;
