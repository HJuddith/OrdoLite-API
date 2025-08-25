import "dotenv/config";
import argon2 from "argon2";
import {
  sequelize,
  User,
  Medication,
  Prescription,
  PrescriptionLine,
  Attachment,
  Notification,
  RefreshToken,
  ResetPassword,
} from "../src/models/index.js";
import { demoData } from "../seeders/demo.data.js"; // ou `import demoData from ...` si export default

async function main() {
  // On regroupe les modèles pour les passer au seeder
  const models = {
    User,
    Medication,
    Prescription,
    PrescriptionLine,
    Attachment,
    Notification,
    RefreshToken,
    ResetPassword,
  };

  try {
    await sequelize.sync({ force: true }); // ⚠️ drop + recreate
    console.log("Tables créées avec succès");

    await demoData(models); // le seeder reçoit les modèles
    console.log("Données de démo insérées avec succès");
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
