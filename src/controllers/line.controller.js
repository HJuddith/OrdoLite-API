import { Medication, Prescription, PrescriptionLine } from '../models/index.js';
import { assertOwnershipOrAdmin } from '../utils/ownership.js';

export const LineController = {
  list: async (req, res, next) => {
    try {
      const { id } = req.params; 
      const p = await Prescription.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Prescription not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      const lines = await PrescriptionLine.findAll({ where: { prescription_id: id }, order: [['start_date','DESC']] });
      res.json(lines);
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      const { id } = req.params;
      const p = await Prescription.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Prescription not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      const payload = { ...req.body, prescription_id: id };
      const line = await PrescriptionLine.create(payload);
      res.status(201).json(line);
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      const line = await PrescriptionLine.findByPk(req.params.lineId);
      if (!line) return res.status(404).json({ message: 'Line not found' });
      const p = await Prescription.findByPk(line.prescription_id);
      assertOwnershipOrAdmin(p.user_id, req.user);
      await line.update(req.body);
      res.json(line);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const line = await PrescriptionLine.findByPk(req.params.lineId);
      if (!line) return res.status(404).json({ message: 'Line not found' });
      const p = await Prescription.findByPk(line.prescription_id);
      assertOwnershipOrAdmin(p.user_id, req.user);
      await line.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
