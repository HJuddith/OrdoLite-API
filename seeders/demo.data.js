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

export async function demoData() {
  console.log("Insertion de données de démonstration…");

  try {
    // s'assurer que la connexion est ok
    await sequelize.authenticate();
    // Optionnel : pour forcer la création (destructive en prod)
    // await sequelize.sync({ alter: false });

    console.log("Hash du mot de passe…");
    const passwordHash = await argon2.hash("pass123", {
      type: argon2.argon2id,
    });

    // ==== USERS =============================================================
    console.log("Création des utilisateurs…");
    const admin = await User.create({
      first_name: "Admin",
      last_name: "Test",
      email: "admin@example.com",
      password: passwordHash,
      role: "ADMIN",
    });

    const alice = await User.create({
      first_name: "Alice",
      last_name: "Dupont",
      email: "alice-seed@example.com",
      password: passwordHash,
      role: "USER",
    });

    const bob = await User.create({
      first_name: "Bob",
      last_name: "Martin",
      email: "bob@example.com",
      password: passwordHash,
      role: "USER",
    });

    // ==== MEDICATIONS =======================================================
    console.log("Création des médicaments…");
    const [para, ibu, amox] = await Medication.bulkCreate(
      [
        { name: "Paracétamol", form: "Comprimé", base_dosage: "500 mg" },
        { name: "Ibuprofène", form: "Comprimé", base_dosage: "200 mg" },
        { name: "Amoxicilline", form: "Gélule", base_dosage: "1 g" },
      ],
      { returning: true }
    );

    // ==== PRESCRIPTIONS =====================================================
    console.log("Création des ordonnances d'Alice…");
    const [ordoA, ordoB] = await Prescription.bulkCreate(
      [
        {
          title: "Ordo Alice A",
          prescriber: "Dr. House",
          notes: "Douleur légère",
          user_id: alice.user_id,
        },
        {
          title: "Ordo Alice B",
          prescriber: "Dr. Grey",
          notes: "Infection",
          user_id: alice.user_id,
        },
      ],
      { returning: true }
    );

    console.log("Création des ordonnances de Bob…");
    const [ordoC] = await Prescription.bulkCreate(
      [
        {
          title: "Ordo Bob C",
          prescriber: "Dr. Strange",
          notes: "Fièvre",
          user_id: bob.user_id,
        },
      ],
      { returning: true }
    );

    // ==== PRESCRIPTION LINES ===============================================
    console.log("Ajout des lignes d’ordonnance…");
    const now = Date.now();
    const d = (days) => new Date(now + days * 86400000);

    await PrescriptionLine.bulkCreate([
      {
        prescription_id: ordoA.prescription_id,
        medication_id: para.medication_id,
        dosage: "500 mg",
        start_date: new Date(),
        end_date: d(7),
      },
      {
        prescription_id: ordoA.prescription_id,
        medication_id: ibu.medication_id,
        dosage: "200 mg",
        start_date: new Date(),
        end_date: d(5),
      },
      {
        prescription_id: ordoB.prescription_id,
        medication_id: amox.medication_id,
        dosage: "1 g",
        start_date: new Date(),
        end_date: d(10),
      },
      {
        prescription_id: ordoC.prescription_id,
        medication_id: para.medication_id,
        dosage: "500 mg",
        start_date: new Date(),
        end_date: d(3),
      },
    ]);

    // ==== ATTACHMENTS =======================================================
    console.log("Ajout des pièces jointes…");
    await Attachment.bulkCreate([
      {
        mime_type: "image/jpeg",
        file_size_bytes: 150000,
        file_path: "uploads/ordo_a.jpg",
        sha256: "dummyhash1",
        prescription_id: ordoA.prescription_id,
      },
      {
        mime_type: "application/pdf",
        file_size_bytes: 200000,
        file_path: "uploads/ordo_b.pdf",
        sha256: "dummyhash2",
        prescription_id: ordoB.prescription_id,
      },
    ]);

    // ==== NOTIFICATIONS =====================================================
    console.log("Création des notifications…");
    await Notification.bulkCreate([
      {
        notif_type: "REMINDER",
        content: "Votre ordonnance expire bientôt.",
        is_read: false,
        user_id: alice.user_id,
      },
      {
        notif_type: "INFO",
        content: "Nouveau médicament disponible.",
        is_read: false,
        user_id: bob.user_id,
      },
    ]);

    // ==== REFRESH TOKENS ====================================================
    console.log("Ajout des refresh tokens…");
    await RefreshToken.bulkCreate([
      { token: "tokenAlice", user_id: alice.user_id, expires_at: d(30) },
      { token: "tokenBob", user_id: bob.user_id, expires_at: d(30) },
    ]);

    // ==== RESET PASSWORD ====================================================
    console.log("Création d’un reset password pour Alice…");
    await ResetPassword.create({
      token: "resetAlice",
      user_id: alice.user_id,
      expires_at: new Date(Date.now() + 3_600_000), // +1h
    });

    console.log("Données de démonstration insérées.");
  } catch (err) {
    console.error("Erreur durant le seed :", err);
    // Optionnel : définir un code d’erreur process pour CI/CD
    process.exitCode = 1;
  } finally {
    console.log("Fermeture de la base…");
    await sequelize.close();
    console.log("Terminé.");
  }
};
