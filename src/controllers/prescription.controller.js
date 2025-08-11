import { Attachment, Prescription, PrescriptionLine, User } from '../models/index.js';
import { assertOwnershipOrAdmin } from '../utils/ownership.js';

export const PrescriptionController = {
  listMine: async (req, res, next) => {
    try {
      const items = await Prescription.findAll({
        where: { user_id: req.user.userId },
        order: [['created_at','DESC']]
      });
      res.json(items);
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      const { title, prescriber, notes } = req.body;
      const item = await Prescription.create({ title, prescriber, notes, user_id: req.user.userId });
      res.status(201).json(item);
    } catch (e) { next(e); }
  },

  get: async (req, res, next) => {
    try {
      const p = await Prescription.findByPk(req.params.id);
      if (!p) return res.status(404).json({ message: 'Not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      res.json(p);
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      const p = await Prescription.findByPk(req.params.id);
      if (!p) return res.status(404).json({ message: 'Not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      const { title, prescriber, notes } = req.body;
      await p.update({ title, prescriber, notes });
      res.json(p);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const p = await Prescription.findByPk(req.params.id);
      if (!p) return res.status(404).json({ message: 'Not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      await p.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
