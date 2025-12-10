const ChatService = require("../services/ChatService");
const { getMember, joinRoom } = require("../state"); // Import des fonctions de gestion d'état

module.exports = (io, socket) => {

    //  1. Événement: Rejoindre un salon
    socket.on("join:salon", ({ salonId }) => {
        const { userId, username } = socket.data;

        // CRITIQUE : Ajoute le membre dans l'état et vérifie s'il est banni
        const member = joinRoom(socket.id, salonId, userId, username);

        if (member === null) {
            // Refus de l'adhésion si joinRoom retourne null (utilisateur banni)
            return socket.emit("admin:error", { error: "Vous êtes banni du salon." });
        }

        // Si l'adhésion est réussie :
        socket.join(salonId); // Ajout du socket à la room Socket.io
        socket.data.salonId = salonId;
        socket.data.role = member.role; // Stockage du rôle pour les futures vérifications

        // Récupération et envoi de l'historique du chat UNIQUEMENT au membre qui vient de se connecter
        const history = ChatService.getMessages(salonId);
        socket.emit("chat:history", history);

        console.log(`[JOIN] ${username} a rejoint ${salonId}`);
    });

    //  2. Événement: Envoi d'un message
    socket.on("chat:message", ({ text }) => {
        const { userId, username, salonId } = socket.data;

        // Délègue la validation et l'ajout à la logique métier (ChatService)
        const result = ChatService.ajouterMessage(userId, username, text, salonId);

        if (!result.success) {
            // Retourne l'erreur (ex: message trop long) UNIQUEMENT à l'expéditeur
            return socket.emit("chat:error", { error: result.error });
        }

        // Diffusion du message réussi à TOUS les membres du salon
        io.to(salonId).emit("chat:message", result.message);
    });

    //  3. Événement: Suppression d'un message
    socket.on("chat:delete", ({ messageId }) => {
        const { userId, salonId } = socket.data;

        const member = getMember(salonId, userId);
        // La suppression est permise si l'utilisateur est admin
        const isAdmin = member && member.role === "admin";

        // Délègue la vérification de permission et la suppression à ChatService
        const result = ChatService.supprimerMessage(messageId, userId, isAdmin);

        if (!result.success) {
            return socket.emit("chat:error", { error: result.error });
        }

        // Diffusion de l'instruction de suppression à TOUS les clients du salon
        io.to(salonId).emit("chat:deleted", { messageId });
    });
};