import { execSync } from "node:child_process";
import "dotenv/config";

export default async () => {
  process.env.NODE_ENV = "test";
  // Applique les migrations sur la DB de test
  execSync(`npx sequelize-cli db:migrate --env development`, { stdio: "inherit" });
};
