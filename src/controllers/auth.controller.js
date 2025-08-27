import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { RefreshToken, ResetPassword, User } from '../models/index.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // true si port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

function signAccess(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_ACCESS_SECRET,              
    { subject: String(user.user_id), expiresIn: ACCESS_TTL }
  );
}

function signRefresh(user) {
  return jwt.sign(
    {
      typ: "refresh",
      sub: user.user_id,
      jti: uuid()
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

export const AuthController = {
  register: async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(409).json({ message: 'Email already used' });

      // Argon2id
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // ~64MB
        timeCost: 3,
        parallelism: 1,
      });

      const user = await User.create({
        first_name,
        last_name,
        email,
        password: passwordHash,              
        role: 'USER',
      });

      res.status(201).json({ user_id: user.user_id, email: user.email });
    } catch (e) {
       next(e);
      }
   },

  login: async (req, res, next) => {
    try {
      const { email, password, device_info } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const ok = await argon2.verify(user.password, password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

      // Génération access token
      const access = signAccess(user);

      // Génération refresh token avec identifiant unique
      const refresh = jwt.sign(
          {
              typ: 'refresh',
              sub: user.user_id,
              jti: crypto.randomUUID()
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Supprimer les anciens refresh tokens du même utilisateur
      await RefreshToken.destroy({
        where: { user_id: user.user_id }
      });

      // Stocker le refresh en DB
      await RefreshToken.create({
        user_id: user.user_id,
        token: refresh,
        expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        device_info,
      });

      res.json({ accessToken: access, refreshToken: refresh });
    } catch (e) { 
      next(e); 
    }
  },

  refresh: async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ message: 'Missing refresh_token' });
    }

    // 1) Vérifier le token
    let payload;
    try {
      payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      return next(err);
    }

    // Sécurité : vérifier qu'on a bien un sub
    if (!payload.sub) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    // 2) Vérifier qu’on connaît ce refresh en DB
    const record = await RefreshToken.findOne({
      where: { token: refresh_token, user_id: payload.sub }
    });

    if (!record || record.expires_at < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh' });
    }

    // 3) Générer un nouvel access token
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh' });
    }

    const access = signAccess(user);
    res.json({ access_token: access });
  } catch (e) {
    next(e);
  }
},

  me: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password'] } });
      res.json(user);
    } catch (e) { 
      next(e); 
    }
  },

  logout: async (req, res, next) => {
    try {
      //
      // si le client envoie son refresh actuel, on le révoque ici :
      const { refresh_token } = req.body;
      if (refresh_token) await RefreshToken.destroy({ where: { token: refresh_token, user_id: req.user.userId } });
      res.status(204).end();
    } catch (e) {
       next(e); 
      }
  },

 requestReset: async (req, res, next) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ where: { email } });

     if (user) {
       // Vérifier la dernière demande
       const lastRequest = await ResetPassword.findOne({
         where: { user_id: user.user_id },
         order: [["createdAt", "DESC"]],
       });

       if (lastRequest && Date.now() - lastRequest.createdAt < 60 * 60 * 1000) {
         return res.status(429).json({
           message:
             "Vous avez déjà demandé une réinitialisation dans la dernière heure.",
         });
       }

       const token = uuid();
       await ResetPassword.create({
         user_id: user.user_id,
         token,
         expires_at: new Date(Date.now() + 3600 * 1000), // 1h
       });

       const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

       await transporter.sendMail({
         from: '"OrdoLite Support" <support@ordolite.com>',
         to: email,
         subject: "Réinitialisation de votre mot de passe",
         html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
       });
     }

     res.json({
       message:
         "Si le compte existe, un email de réinitialisation sera envoyé.",
     });
   } catch (e) {
     next(e);
   }
},

  resetPassword: async (req, res, next) => {
    try {
      const { token, new_password } = req.body;

      const rp = await ResetPassword.findOne({ where: { token, is_used: false } });
      if (!rp || rp.expires_at < new Date()) {
        return res.status(400).json({ message: 'Invalid/expired token' });
      }

      const newHash = await argon2.hash(new_password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      await User.update({ password: newHash }, { where: { user_id: rp.user_id } });
      rp.is_used = true;
      await rp.save();

      res.json({ message: 'Password updated' });
    } catch (e) {
       next(e); 
      }
  },
};
