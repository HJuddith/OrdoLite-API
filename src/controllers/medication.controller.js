import { Medication } from '../models/index.js';

export const MedicationController = {
  list: async (req, res, next) => {
    try {
      const q = req.query.q?.trim();
      const where = q ? { name: { [Op.iLike]: `%${q}%` } } : undefined;
      const meds = await Medication.findAll({ where, order: [['name','ASC']] });
      res.json(meds);
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      const med = await Medication.create(req.body);
      res.status(201).json(med);
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      const med = await Medication.findByPk(req.params.id);
      if (!med) return res.status(404).json({ message: 'Not found' });
      await med.update(req.body);
      res.json(med);
    } catch (e) { next(e); }
  },
  
  remove: async (req, res, next) => {
    try {
      const med = await Medication.findByPk(req.params.id);
      if (!med) return res.status(404).json({ message: 'Not found' });
      await med.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
