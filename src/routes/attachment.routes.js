import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { AttachmentController } from '../controllers/attachment.controller.js';
import { idSchema } from '../schemas/common.js';
import { attachmentCreateSchema } from '../schemas/attachment.schema.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /api/v1/prescriptions/{id}/attachments:
 *   get:
 *     tags: [Attachments]
 *     summary: List all attachments for a prescription
 *     description: Retrieve all attached files (images, PDFs, etc.) for a specific prescription by its ID.
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the prescription.
 *     responses:
 *       200:
 *         description: A list of attachments for the prescription.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attachment'
 */
router.get('/:id/attachments', validate(idSchema, 'params'), AttachmentController.list);

/**
 * @openapi
 * /api/v1/prescriptions/{id}/attachments:
 *   post:
 *     tags: [Attachments]
 *     summary: Upload a new attachment (image or PDF)
 *     description: Upload a new file attachment to the specified prescription.
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the prescription.
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
 *                 description: The file to upload (image or PDF).
 *               mime_type:
 *                 type: string
 *               file_size_bytes:
 *                 type: integer
 *               file_path:
 *                 type: string
 *               sha256:
 *                 type: string
 *                 pattern: '^[0-9A-Fa-f]{64}$'
 *               prescription_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The attachment was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       400:
 *         description: Missing or invalid file.
 */
router.post(
  '/:id/attachments',
  validate(idSchema, 'params'),
  validate(attachmentCreateSchema, 'body'),
  AttachmentController.uploadOne,
  AttachmentController.create
);

/**
 * @openapi
 * /api/v1/prescriptions/attachments/{pieceId}:
 *   get:
 *     tags: [Attachments]
 *     summary: Download or stream an attachment
 *     description: Retrieve a file stream for the given attachment ID.
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: pieceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attachment.
 *     responses:
 *       200:
 *         description: File stream of the attachment.
 *       404:
 *         description: Attachment not found.
 */
router.get('/attachments/:pieceId', validate(idSchema, 'params'), AttachmentController.stream);

/**
 * @openapi
 * /api/v1/prescriptions/attachments/{pieceId}:
 *   delete:
 *     tags: [Attachments]
 *     summary: Delete an attachment
 *     description: Permanently delete an attachment by its ID.
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: pieceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attachment.
 *     responses:
 *       204:
 *         description: Attachment successfully deleted.
 *       404:
 *         description: Attachment not found.
 */
router.delete('/attachments/:pieceId', validate(idSchema, 'params'), AttachmentController.remove);

export default router;
