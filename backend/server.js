const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chatHandler = require('./src/handlers/chatHandler');
const adminHandler = require('./src/handlers/adminHandler'); // [Futur]
const { joinRoom, removeMember } = require('./src/state'); // Mise à jour des dépendances

const app = express();
const server = http.createServer(app);

// Configuration CORS pour le Front-End React
app.use(cors({ origin: "http://localhost:3000" })); 

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // --- Simulation d'Authentification (MVP) ---
    // Les infos utilisateur devraient venir d'un token, ici on les simule
    const userId = socket.handshake.query.userId || socket.id;
    const username = socket.handshake.query.username || `Utilisateur-${socket.id.substring(0, 4)}`;
    const salonId = socket.handshake.query.salonId || 'TEST_CODE';
    
    // Le socket rejoindra la room plus tard dans 'join:salon'

    // Nous allons utiliser la logique de 'join:salon' du chatHandler pour le moment.
    
    // Stockage des infos de base sur le socket AVANT le join:salon
    socket.data = { userId, username, salonId };

    // Les handlers seront appelés à chaque connexion
    chatHandler(io, socket);
    adminHandler(io, socket); // Prêt pour l'étape suivante

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
        // Logique de nettoyage des membres via removeMember ici si le socket.data est encore disponible
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Serveur Socket.io lancé sur http://localhost:${PORT}`);
});