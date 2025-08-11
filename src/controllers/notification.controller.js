import { Notification } from '../models/index.js';

export const NotificationController = {
  listMine: async (req, res, next) => {
    try {
      const items = await Notification.findAll({
        where: { user_id: req.user.userId },
        order: [['created_at','DESC']]
      });
      res.json(items);
    } catch (e) { next(e); }
  },
  markRead: async (req, res, next) => {
    try {
      const n = await Notification.findByPk(req.params.id);
      if (!n || Number(n.user_id) !== Number(req.user.userId))
        return res.status(404).json({ message: 'Not found' });
      await n.update({ is_read: true });
      res.json(n);
    } catch (e) { next(e); }
  },
  clearAll: async (req, res, next) => {
    try {
      await Notification.destroy({ where: { user_id: req.user.userId } });
      res.status(204).end();
    } catch (e) { next(e); }
  }
};