import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { AttachmentController } from '../controllers/attachment.controller.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /prescriptions/{id}/attachments:
 *   get:
 *     tags: [Attachments]
 *     summary: Liste les pièces jointes d'une prescription
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des pièces jointes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attachment'
 */
router.get('/:id/attachments', AttachmentController.list);

/**
 * @openapi
 * /prescriptions/{id}/attachments:
 *   post:
 *     tags: [Attachments]
 *     summary: Upload d'une pièce jointe (image/pdf)
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pièce jointe créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       400:
 *         description: Fichier manquant ou invalide
 */
router.post('/:id/attachments', AttachmentController.uploadOne, AttachmentController.create);

/**
 * @openapi
 * /prescriptions/attachments/{pieceId}:
 *   get:
 *     tags: [Attachments]
 *     summary: Télécharger ou streamer une pièce jointe
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: pieceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Flux du fichier
 *       404:
 *         description: Pièce jointe introuvable
 */
router.get('/attachments/:pieceId', AttachmentController.stream);

/**
 * @openapi
 * /prescriptions/attachments/{pieceId}:
 *   delete:
 *     tags: [Attachments]
 *     summary: Supprimer une pièce jointe
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: pieceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Pièce jointe supprimée
 *       404:
 *         description: Pièce jointe introuvable
 */
router.delete('/attachments/:pieceId', AttachmentController.remove);

export default router;
