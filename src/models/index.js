import userModel, { User } from './user.model.js';
import prescriptionModel, { Prescription } from './prescription.model.js';
import medicationModel, { Medication } from './medication.model.js';
import prescriptionLineModel, { PrescriptionLine } from './prescriptionLine.model.js';
import attachmentModel, { Attachment } from './attachment.model.js';
import notificationModel, { Notification } from './notification.model.js';
import refreshTokenModel, { RefreshToken } from './refreshToken.model.js';
import resetPasswordModel, { ResetPassword } from './resetPassword.model.js';

/**
 * Initialise tous les modèles et leurs associations.
 * @param {import('sequelize').Sequelize} sequelize
 */
export function initModels(sequelize) {
  // 1) Init des modèles (déclare les colonnes/options)
  userModel(sequelize);
  prescriptionModel(sequelize);
  medicationModel(sequelize);
  prescriptionLineModel(sequelize);
  attachmentModel(sequelize);
  notificationModel(sequelize);
  refreshTokenModel(sequelize);
  resetPasswordModel(sequelize);

  // 2) Associations

  // User ↔ Prescription
  User.hasMany(Prescription, {
    foreignKey: 'user_id',
    as: 'prescriptions',
    onDelete: 'CASCADE',
  });
  Prescription.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User ↔ Notification
  User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
    onDelete: 'CASCADE',
  });
  Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User ↔ RefreshToken
  User.hasMany(RefreshToken, {
    foreignKey: 'user_id',
    as: 'refreshTokens',
    onDelete: 'CASCADE',
  });
  RefreshToken.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // User ↔ ResetPassword
  User.hasMany(ResetPassword, {
    foreignKey: 'user_id',
    as: 'resetRequests',
    onDelete: 'CASCADE',
  });
  ResetPassword.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Prescription ↔ PrescriptionLine
  Prescription.hasMany(PrescriptionLine, {
    foreignKey: 'prescription_id',
    as: 'lines',
    onDelete: 'CASCADE',
  });
  PrescriptionLine.belongsTo(Prescription, {
    foreignKey: 'prescription_id',
    as: 'prescription',
  });

  // Prescription ↔ Attachment
  Prescription.hasMany(Attachment, {
    foreignKey: 'prescription_id',
    as: 'attachments',
    onDelete: 'CASCADE',
  });
  Attachment.belongsTo(Prescription, {
    foreignKey: 'prescription_id',
    as: 'prescription',
  });

  // Medication ↔ PrescriptionLine
  Medication.hasMany(PrescriptionLine, {
    foreignKey: 'medication_id',
    as: 'lines',
  });
  PrescriptionLine.belongsTo(Medication, {
    foreignKey: 'medication_id',
    as: 'medication',
  });

  // 3) Expose un objet pratique
  return {
    User,
    Prescription,
    Medication,
    PrescriptionLine,
    Attachment,
    Notification,
    RefreshToken,
    ResetPassword,
  };
}
