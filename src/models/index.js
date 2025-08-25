import { sequelize } from "./sequelize.js";

import userModel from "./User.model.js";
import prescriptionModel from "./Prescription.model.js";
import medicationModel from "./Medication.model.js";
import prescriptionLineModel from "./PrescriptionLine.model.js";
import attachmentModel from "./Attachment.model.js";
import notificationModel from "./Notification.model.js";
import refreshTokenModel from "./RefreshToken.model.js";
import resetPasswordModel from "./ResetPassword.model.js";

// Initialisation des modèles
const User = userModel(sequelize);
const Prescription = prescriptionModel(sequelize);
const Medication = medicationModel(sequelize);
const PrescriptionLine = prescriptionLineModel(sequelize);
const Attachment = attachmentModel(sequelize);
const Notification = notificationModel(sequelize);
const RefreshToken = refreshTokenModel(sequelize);
const ResetPassword = resetPasswordModel(sequelize);


// Associations
User.hasMany(Prescription, {
  foreignKey: "user_id",
  as: "prescriptions",
  onDelete: "CASCADE",
});
Prescription.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "notifications",
  onDelete: "CASCADE",
});
Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "refreshTokens",
  onDelete: "CASCADE",
});
RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(ResetPassword, {
  foreignKey: "user_id",
  as: "resetRequests",
  onDelete: "CASCADE",
});
ResetPassword.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Prescription.hasMany(PrescriptionLine, {
  foreignKey: "prescription_id",
  as: "lines",
  onDelete: "CASCADE",
});
PrescriptionLine.belongsTo(Prescription, {
  foreignKey: "prescription_id",
  as: "prescription",
});

Prescription.hasMany(Attachment, {
  foreignKey: "prescription_id",
  as: "attachments",
  onDelete: "CASCADE",
});
Attachment.belongsTo(Prescription, {
  foreignKey: "prescription_id",
  as: "prescription",
});

Medication.hasMany(PrescriptionLine, {
  foreignKey: "medication_id",
  as: "lines",
});
PrescriptionLine.belongsTo(Medication, {
  foreignKey: "medication_id",
  as: "medication",
});

// Exports
export {
  sequelize,
  User,
  Prescription,
  Medication,
  PrescriptionLine,
  Attachment,
  Notification,
  RefreshToken,
  ResetPassword,
};


export function initModels() {
  return {
    sequelize,
    User,
    Medication,
    Prescription,
    PrescriptionLine,
    Attachment,
    Notification,
    RefreshToken,
    ResetPassword,
  };
}