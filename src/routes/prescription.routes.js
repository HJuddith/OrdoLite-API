import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { PrescriptionController } from '../controllers/prescription.controller.js';
import { LineController } from '../controllers/line.controller.js';
import { prescriptionCreateSchema, prescriptionUpdateSchema } from '../schemas/prescription.schema.js';
import { idSchema } from '../schemas/common.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /api/v1/prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: List all prescriptions for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 *             example:
 *               - prescription_id: 1
 *                 title: "Antibiotiques - Amoxicilline"
 *                 prescriber: "Dr. Martin"
 *                 notes: "À prendre pendant 7 jours"
 *                 created_at: "2025-08-10T10:00:00Z"
 *                 updated_at: "2025-08-10T10:00:00Z"
 *               - prescription_id: 2
 *                 title: "Vitamine D"
 *                 prescriber: "Dr. Dupont"
 *                 notes: "1 comprimé tous les matins"
 *                 created_at: "2025-08-05T09:30:00Z"
 *                 updated_at: "2025-08-05T09:30:00Z"
 */
router.get('/', PrescriptionController.listMine);

/**
 * @openapi
 * /api/v1/prescriptions:
 *   post:
 *     tags: [Prescriptions]
 *     summary: Create a new prescription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionCreateRequest'
 *           example:
 *             title: "Ibuprofène 400mg"
 *             prescriber: "Dr. Bernard"
 *             notes: "1 comprimé après les repas"
 *     responses:
 *       201:
 *         description: Prescription successfully created
 *         content:
 *           application/json:
 *             example:
 *               prescription_id: 3
 *               title: "Ibuprofène 400mg"
 *               prescriber: "Dr. Bernard"
 *               notes: "1 comprimé après les repas"
 *               created_at: "2025-08-11T12:00:00Z"
 *               updated_at: "2025-08-11T12:00:00Z"
 */
router.post('/', validate(prescriptionCreateSchema, 'body'), PrescriptionController.create);

/**
 * @openapi
 * /api/v1/prescriptions/{id}:
 *  get:
 *     tags: [Prescriptions]
 *     summary: Retrieve a prescription by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Prescription found
 *         content:
 *           application/json:
 *             example:
 *               prescription_id: 1
 *               title: "Antibiotiques - Amoxicilline"
 *               prescriber: "Dr. Martin"
 *               notes: "À prendre pendant 7 jours"
 *               created_at: "2025-08-10T10:00:00Z"
 *               updated_at: "2025-08-10T10:00:00Z"
 *       404:
 *         description: Prescription not found
 */
router.get('/:id', validate(idSchema, 'params'), PrescriptionController.get);

/**
 * @openapi
 * /api/v1/prescriptions/{id}:
 *   patch:
 *     tags: [Prescriptions]
 *     summary: Update a prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionUpdateRequest'
 *           example:
 *             title: "Ibuprofène 200mg"
 *             notes: "Réduire la dose à 200mg"
 *     responses:
 *       200:
 *         description: Prescription successfully updated
 *         content:
 *           application/json:
 *             example:
 *               prescription_id: 1
 *               title: "Ibuprofène 200mg"
 *               prescriber: "Dr. Bernard"
 *               notes: "Réduire la dose à 200mg"
 *               created_at: "2025-08-10T10:00:00Z"
 *               updated_at: "2025-08-11T14:00:00Z"
 *       404:
 *         description: Prescription not found
 */
router.patch('/:id', validate(idSchema, 'params'), validate(prescriptionUpdateSchema, 'body'), PrescriptionController.update);

/**
 * @openapi
 * /api/v1/prescriptions/{id}:
 *   delete:
 *     tags: [Prescriptions]
 *     summary: Delete a prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Prescription successfully deleted
 *       404:
 *         description: Prescription not found
 */
router.delete('/:id', validate(idSchema, 'params'), PrescriptionController.remove);

/**
 * @openapi
 * /api/v1/prescriptions/{id}/lines:
 *   get:
 *     tags: [Lines]
 *     summary: List all lines of a prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: A list of prescription lines
 *         content:
 *           application/json:
 *             example:
 *               - line_id: 10
 *                 medication_id: 5
 *                 start_date: "2025-08-11"
 *                 end_date: "2025-08-18"
 *                 dose: 400
 *                 unit: "mg"
 *                 frequency_day: 3
 *                 instructions: "Après les repas"
 *                 status: "active"
 *                 created_at: "2025-08-11T10:00:00Z"
 *                 updated_at: "2025-08-11T10:00:00Z"
 *       404:
 *         description: Prescription not found
 */
router.get('/:id/lines', validate(idSchema, 'params'), LineController.list);

/**
 * @openapi
 * /api/v1/prescriptions/{id}/lines:
 *   post:
 *     tags: [Lines]
 *     summary: Add a line to a prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionLineCreateRequest'
 *           example:
 *             medication_id: 5
 *             start_date: "2025-08-11"
 *             end_date: "2025-08-18"
 *             dose: 400
 *             unit: "mg"
 *             frequency_day: 3
 *             instructions: "Après les repas"
 *     responses:
 *       201:
 *         description: Prescription line successfully created
 *         content:
 *           application/json:
 *             example:
 *               line_id: 10
 *               prescription_id: 1
 *               medication_id: 5
 *               start_date: "2025-08-11"
 *               end_date: "2025-08-18"
 *               dose: 400
 *               unit: "mg"
 *               frequency_day: 3
 *               instructions: "Après les repas"
 *               status: "active"
 *               created_at: "2025-08-11T10:00:00Z"
 *               updated_at: "2025-08-11T10:00:00Z"
 *       404:
 *         description: Prescription not found
 */
router.post('/:id/lines', validate(idSchema, 'params'), LineController.create);

/**
 * @openapi
 * /api/v1/prescriptions/lines/{lineId}:
 *   put:
 *     tags: [Lines]
 *     summary: Update a prescription line
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionLineUpdateRequest'
 *           example:
 *             dose: 200
 *             unit: "mg"
 *             instructions: "Prendre matin et soir"
 *     responses:
 *       200:
 *         description: Prescription line successfully updated
 *         content:
 *           application/json:
 *             example:
 *               line_id: 10
 *               prescription_id: 1
 *               medication_id: 5
 *               start_date: "2025-08-11"
 *               end_date: "2025-08-18"
 *               dose: 200
 *               unit: "mg"
 *               frequency_day: 2
 *               instructions: "Prendre matin et soir"
 *               status: "active"
 *               created_at: "2025-08-11T10:00:00Z"
 *               updated_at: "2025-08-11T15:00:00Z"
 *       404:
 *         description: Prescription line not found
 */
router.put('/lines/:lineId', validate(idSchema, 'params'), LineController.update);

/**
 * @openapi
 * /api/v1/prescriptions/lines/{lineId}:
 *   delete:
 *     tags: [Lines]
 *     summary: Delete a prescription line
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       204:
 *         description: Prescription line successfully deleted
 *       404:
 *         description: Prescription line not found
 */
router.delete('/lines/:lineId', validate(idSchema, 'params'), LineController.remove);

export default router;
