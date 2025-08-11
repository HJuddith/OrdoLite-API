import 'dotenv/config';
import argon2 from "argon2";
import { sequelize } from './models/sequelize.js';
import { initModels } from './models/index.js';
import demoData from '../seeders/demo.data.js';

async function main() {
  // 1. Init models
  const models = initModels(sequelize);

  // 2. Création des tables
  await sequelize.sync({ force: true }); // force: true = drop + recreate

  console.log('Tables créées avec succès');

  // 3. Insertion des données fictives


  await demoData(models);

  console.log('Données de démo insérées avec succès');

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
