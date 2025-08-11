import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { idSchema } from '../schemas/common.js';
import { notificationMarkReadSchema } from '../schemas/notification.schema.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /api/v1/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List all notifications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/', NotificationController.listMine);

/**
 * @openapi
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the notification to mark as read.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationMarkReadRequest'
 *     responses:
 *       200:
 *         description: Notification successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 */
router.patch(
  '/:id/read',
  validate(idSchema, 'params'),
  validate(notificationMarkReadSchema, 'body'),
  NotificationController.markRead
);

/**
 * @openapi
 * /api/v1/notifications:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete all notifications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Notifications successfully deleted
 */
router.delete('/', NotificationController.clearAll);

export default router;
