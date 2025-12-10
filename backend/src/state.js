// Stockage central en mémoire (RAM) des salons actifs
// Format: { 'salonId': { members: { 'userId': { socketId, username, role, isBanned } } } }
const rooms = {};

/**
 * Ajoute un membre à un salon et vérifie le statut de bannissement.
 * @param {string} socketId - ID de la connexion Socket.io actuelle.
 * @param {string} salonId - ID du salon à rejoindre.
 * @param {string} userId - ID unique de l'utilisateur.
 * @param {string} username - Pseudo de l'utilisateur.
 * @returns {object|null} Les données du membre ou null si banni.
 */
function joinRoom(socketId, salonId, userId, username) {
    if (!rooms[salonId]) {
        // Crée le salon s'il n'existe pas
        rooms[salonId] = { members: {} };
    }

    // 1. VÉRIFICATION DE BAN CRITIQUE
    if (rooms[salonId].members[userId]?.isBanned === true) {
        // Retourne null si l'utilisateur est banni
        return null; 
    }
    
    // 2. Gestion de la reconnexion (utilisateur déjà connu)
    if (rooms[salonId].members[userId]) {
        // Met à jour l'ID du socket pour la nouvelle connexion
        rooms[salonId].members[userId].socketId = socketId;
        return rooms[salonId].members[userId]; 
    }

    // 3. Logique d'attribution de rôle
    // Le premier membre qui rejoint un salon devient l'administrateur
    const role = Object.keys(rooms[salonId].members).length === 0
        ? "admin"
        : "member";

    // Ajout du nouvel utilisateur à l'état
    rooms[salonId].members[userId] = {
        socketId,
        username,
        role,
        isBanned: false // Statut initial non banni
    };

    return rooms[salonId].members[userId];
}

/**
 * Récupère les données d'un membre (rôle, statut de ban).
 */
function getMember(salonId, userId) {
    // Utilisation du chaînage optionnel (?) pour éviter un crash si le salon ou le membre n'existe pas
    return rooms[salonId]?.members[userId] || null;
}

/**
 * Récupère l'ID du socket d'un membre (critique pour la fonction KICK).
 */
function getSocketId(salonId, userId) {
    return rooms[salonId]?.members[userId]?.socketId || null;
}

/**
 * Retire un membre de l'état (appelé lors de la déconnexion ou d'un KICK/BAN).
 */
function removeMember(salonId, userId) {
    if (!rooms[salonId] || !rooms[salonId].members[userId]) return false;

    delete rooms[salonId].members[userId];
    return true;
}

module.exports = {
    rooms,
    joinRoom,
    getMember,
    getSocketId,
    removeMember
};