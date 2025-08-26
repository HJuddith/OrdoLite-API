import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED = new Set(['image/jpeg','image/png','application/pdf']);

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { id } = req.params; // prescription id
      const dir = path.join(process.cwd(), 'uploads', String(id));
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '';
      const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
      cb(null, name);
    }
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED.has(file.mimetype)) return cb(new Error('Unsupported file type'));
    cb(null, true);
  }
});