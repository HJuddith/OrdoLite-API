import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema, resetPasswordConfirmSchema, resetPasswordRequestSchema } from '../schemas/index.js';

const router = Router();


/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscrire un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterRequest' }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', validate({ body: registerSchema }), AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Se connecter avec un email et un mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *     responses:
 *       200:
 *         description: Jetons d'authentification
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login',validate({ body: loginSchema }), AuthController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Obtenir un nouveau jeton d'accès à partir d'un refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RefreshRequest' }
 *     responses:
 *       200:
 *         description: Nouveau jeton d'accès
 *       401:
 *         description: Refresh token invalide
 */
router.post('/refresh', AuthController.refresh);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Données de l'utilisateur actuel
 *       401:
 *         description: Non autorisé
 */
router.get('/me', authRequired, AuthController.me);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Déconnecter l'utilisateur actuel
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       204:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non autorisé
 */
router.post('/logout', authRequired, AuthController.logout);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Demander un lien de réinitialisation de mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Lien de réinitialisation envoyé (même si l'email n'existe pas)
 */
router.post('/forgot-password',validate({ body: resetPasswordRequestSchema }), AuthController.requestReset);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Réinitialiser le mot de passe avec le token fourni
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.post('/reset-password', validate({ body: resetPasswordConfirmSchema }), AuthController.resetPassword);

export default router;
