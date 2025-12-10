const { getMember, removeMember, getSocketId } = require("../state");

module.exports = (io, socket) => {

    //  1. Événement : Expulsion d'un membre (KICK)
    socket.on("admin:kick", ({ targetId }) => {
        const { userId, salonId } = socket.data;

        const admin = getMember(salonId, userId);
        const target = getMember(salonId, targetId);

        // --- Vérifications de Sécurité ---
        if (!admin || admin.role !== "admin") {
            return socket.emit("admin:error", { error: "Permission refusée." });
        }
        if (!target) {
            return socket.emit("admin:error", { error: "Membre introuvable." });
        }
        if (targetId === userId) {
            return socket.emit("admin:error", { error: "Impossible de vous expulser vous-même." });
        }
        // Empêche un admin de cibler un autre admin
        if (target.role === "admin") {
            return socket.emit("admin:error", { error: "Impossible d'expulser un autre administrateur." });
        }

        // --- Exécution du KICK ---
        const targetSocketId = getSocketId(salonId, targetId);
        const targetSocket = io.sockets.sockets.get(targetSocketId); // Récupère l'objet Socket de la cible

        if (targetSocket) {
            targetSocket.disconnect(true); // Déconnexion forcée
            targetSocket.emit("admin:kicked", { reason: "Vous avez été expulsé." }); // Message privé
        }

        removeMember(salonId, targetId); // Nettoyage de l'état
        
        // Notification générale
        io.to(salonId).emit("admin:kicked", { userId: targetId, username: target.username });
        console.log(`[ADMIN] ${admin.username} a expulsé ${target.username}`);
    });

    //  2. Événement : Bannissement d'un membre (BAN)
    socket.on("admin:ban", ({ targetId }) => {
        const { userId, salonId } = socket.data;

        const admin = getMember(salonId, userId);
        const target = getMember(salonId, targetId);

        // --- Vérifications de Sécurité (similaires au kick) ---
        if (!admin || admin.role !== "admin") {
            return socket.emit("admin:error", { error: "Permission refusée." });
        }
        if (!target) {
            return socket.emit("admin:error", { error: "Membre introuvable." });
        }
        if (targetId === userId) {
            return socket.emit("admin:error", { error: "Impossible de vous bannir vous-même." });
        }
        // 🔥 CORRECTION CRITIQUE : Empêche un admin de cibler un autre admin
        if (target.role === "admin") {
            return socket.emit("admin:error", { error: "Impossible de bannir un autre administrateur." });
        }

        // --- Exécution du BAN ---
        target.isBanned = true; // CRITIQUE : Marque l'utilisateur comme banni dans l'état

        const targetSocketId = getSocketId(salonId, targetId);
        const targetSocket = io.sockets.sockets.get(targetSocketId);

        if (targetSocket) {
            targetSocket.disconnect(true); // KICK immédiat
        }

        removeMember(salonId, targetId); // Retrait du salon après le ban

        // Notification générale
        io.to(salonId).emit("admin:banned", { userId: targetId, username: target.username });
        console.log(`[ADMIN] ${admin.username} a banni ${target.username}`);
    });
};