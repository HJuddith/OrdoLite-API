import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { NotificationController } from '../controllers/notification.controller.js';

const router = Router();

router.use(authRequired);

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Liste des notifications de l'utilisateur connecté
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Liste des notifications
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
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Marquer une notification comme lue
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Notification mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Not found
 */
router.patch('/:id/read', NotificationController.markRead);

/**
 * @openapi
 * /notifications:
 *   delete:
 *     tags: [Notifications]
 *     summary: Supprimer toutes les notifications de l'utilisateur connecté
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       204:
 *         description: Notifications supprimées
 */
router.delete('/', NotificationController.clearAll);

export default router;
