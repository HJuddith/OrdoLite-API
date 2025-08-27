import dotenv from "dotenv";
import "./config/env.js";
import { app, logger } from "./app.js";
import http from "http";
import { initSocket } from "./socket/index.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const server = http.createServer(app);

// Initialisation Socket.IO
initSocket(server);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Serveur démarré sur le port ${PORT}`);
});
