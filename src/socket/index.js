import { Server } from 'socket.io';

/**
 * Initialise Socket.IO sur un serveur HTTP.
 * @param {import('http').Server} server
 */
export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // à restreindre en prod
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 Nouveau client connecté :', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Client déconnecté :', socket.id);
    });
  });
}


// Fonction utilitaire pour envoyer une notification depuis ailleurs
export function sendNotification(event, data, to = null) {
  if (!io) return;
  if (to) {
    io.to(to).emit(event, data); // vers un socket précis
  } else {
    io.emit(event, data); // à tous les clients
  }
}