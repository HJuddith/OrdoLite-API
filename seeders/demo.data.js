import argon2 from "argon2";
export default async function demoData(models) {
  const {
    User,
    Medication,
    Prescription,
    PrescriptionLine,
    Attachment,
    Notification,
    RefreshToken,
    ResetPassword
  } = models;


   const passwordHash = await argon2.hash("pass123", { type: argon2.argon2id });

  // ==== USERS ====
  const admin = await User.create({
    first_name: 'Admin',
    last_name: 'Test',
    email: 'admin@example.com',
    password: passwordHash,
    role: 'ADMIN',
  });

  const alice = await User.create({
    first_name: 'Alice',
    last_name: 'Dupont',
    email: 'alice-seed@example.com',
    password: passwordHash,
    role: 'USER',
  });

  const bob = await User.create({
    first_name: 'Bob',
    last_name: 'Martin',
    email: 'bob@example.com',
    password: passwordHash,
    role: 'USER',
  });

  // ==== MEDICATIONS ====
  const [para, ibu, amox] = await Medication.bulkCreate([
    { name: 'Paracétamol', form: 'Comprimé', base_dosage: '500 mg' },
    { name: 'Ibuprofène', form: 'Comprimé', base_dosage: '200 mg' },
    { name: 'Amoxicilline', form: 'Gélule', base_dosage: '1 g' }
  ], { returning: true });

  // ==== PRESCRIPTIONS ====
  const [ordoA, ordoB] = await Prescription.bulkCreate([
    { title: 'Ordo Alice A', prescriber: 'Dr. House', notes: 'Douleur légère', user_id: alice.user_id },
    { title: 'Ordo Alice B', prescriber: 'Dr. Grey', notes: 'Infection', user_id: alice.user_id }
  ], { returning: true });

  const [ordoC] = await Prescription.bulkCreate([
    { title: 'Ordo Bob C', prescriber: 'Dr. Strange', notes: 'Fièvre', user_id: bob.user_id }
  ], { returning: true });



  // ==== PRESCRIPTION LINES ====
  await PrescriptionLine.bulkCreate([
    { prescription_id: ordoA.prescription_id, medication_id: para.medication_id, dosage: '500 mg', start_date: new Date(), end_date: new Date(Date.now() + 7*86400000) },
    { prescription_id: ordoA.prescription_id, medication_id: ibu.medication_id, dosage: '200 mg', start_date: new Date(), end_date: new Date(Date.now() + 5*86400000) },
    { prescription_id: ordoB.prescription_id, medication_id: amox.medication_id, dosage: '1 g', start_date: new Date(), end_date: new Date(Date.now() + 10*86400000) },
    { prescription_id: ordoC.prescription_id, medication_id: para.medication_id, dosage: '500 mg', start_date: new Date(), end_date: new Date(Date.now() + 3*86400000) }
  ]);

  // ==== ATTACHMENTS ====
  await Attachment.bulkCreate([
    { mime_type: 'image/jpeg', file_size_bytes: 150000, file_path: 'uploads/ordo_a.jpg', sha256: 'dummyhash1', prescription_id: ordoA.prescription_id },
    { mime_type: 'application/pdf', file_size_bytes: 200000, file_path: 'uploads/ordo_b.pdf', sha256: 'dummyhash2', prescription_id: ordoB.prescription_id }
  ]);

  // ==== NOTIFICATIONS ====
  await Notification.bulkCreate([
  {
    notif_type: 'REMINDER',
    content: 'Votre ordonnance expire bientôt.',
    is_read: false,
    user_id: 2
  },
  {
    notif_type: 'INFO',
    content: 'Nouveau médicament disponible.',
    is_read: false,
    user_id: 3
  }
]);
  // ==== REFRESH TOKENS ====
  await RefreshToken.bulkCreate([
    { token: 'tokenAlice', user_id: alice.user_id, expires_at: new Date(Date.now() + 30*86400000) },
    { token: 'tokenBob', user_id: bob.user_id, expires_at: new Date(Date.now() + 30*86400000) }
  ]);

  // ==== RESET PASSWORD ====
  await ResetPassword.create({
    token: 'resetAlice',
    user_id: alice.user_id,
    expires_at: new Date(Date.now() + 3600000)
  });

  console.log('Données de démonstration insérées.');
}

