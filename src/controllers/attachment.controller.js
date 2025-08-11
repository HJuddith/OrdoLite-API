import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime-types';
import { Attachment, Prescription } from '../models/index.js';
import { upload } from '../utils/multer.js';
import { sha256OfBuffer } from '../utils/crypto.js';
import { assertOwnershipOrAdmin } from '../utils/ownership.js';

export const AttachmentController = {
  // middleware multer pour une seule pièce: field name 'file'
  uploadOne: upload.single('file'),

  list: async (req, res, next) => {
    try {
      const { id } = req.params; // prescription id
      const p = await Prescription.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Prescription not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);
      const pieces = await Attachment.findAll({ where: { prescription_id: id }, order: [['created_at','DESC']] });
      res.json(pieces);
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      const { id } = req.params;
      const p = await Prescription.findByPk(id);
      if (!p) return res.status(404).json({ message: 'Prescription not found' });
      assertOwnershipOrAdmin(p.user_id, req.user);

      if (!req.file) return res.status(400).json({ message: 'Missing file' });
      const buf = fs.readFileSync(req.file.path);
      const hash = sha256OfBuffer(buf);
      const piece = await Attachment.create({
        prescription_id: id,
        mime_type: req.file.mimetype,
        file_size_bytes: req.file.size,
        file_path: path.relative(process.cwd(), req.file.path),
        sha256: hash
      });
      res.status(201).json(piece);
    } catch (e) { next(e); }
  },

  stream: async (req, res, next) => {
    try {
      const { pieceId } = req.params;
      const piece = await Attachment.findByPk(pieceId);
      if (!piece) return res.status(404).json({ message: 'Not found' });
      const p = await Prescription.findByPk(piece.prescription_id);
      assertOwnershipOrAdmin(p.user_id, req.user);

      const abs = path.isAbsolute(piece.file_path) ? piece.file_path : path.join(process.cwd(), piece.file_path);
      if (!fs.existsSync(abs)) return res.status(404).json({ message: 'File missing' });
      const type = piece.mime_type || mime.lookup(abs) || 'application/octet-stream';
      res.setHeader('Content-Type', type);
      res.setHeader('Content-Length', piece.file_size_bytes);
      fs.createReadStream(abs).pipe(res);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const { pieceId } = req.params;
      const piece = await Attachment.findByPk(pieceId);
      if (!piece) return res.status(404).json({ message: 'Not found' });
      const p = await Prescription.findByPk(piece.prescription_id);
      assertOwnershipOrAdmin(p.user_id, req.user);

      const abs = path.isAbsolute(piece.file_path) ? piece.file_path : path.join(process.cwd(), piece.file_path);
      try { fs.unlinkSync(abs); } catch {}
      await piece.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
