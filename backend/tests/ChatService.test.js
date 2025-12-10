// Test : ajouterMessage() 
const ChatService = require("../src/services/ChatService");

describe("ChatService - ajouterMessage()", () => {

    test("Message valide doit être accepté", () => {
        const result = ChatService.ajouterMessage("user1", "Aziza", "Hello", "SALON1");
        expect(result.success).toBe(true);
        expect(result.message.text).toBe("Hello");
    });

    test("Message vide doit être refusé", () => {
        const result = ChatService.ajouterMessage("user1", "Aziza", "", "SALON1");
        expect(result.success).toBe(false);
    });

    test("Message trop long doit être refusé", () => {
        const longText = "a".repeat(400);
        const result = ChatService.ajouterMessage("user1", "Aziza", longText, "SALON1");
        expect(result.success).toBe(false);
    });

// Test : supprimerMessage()

    describe("ChatService - supprimerMessage()", () => {

    test("Un auteur peut supprimer son propre message", () => {
        const add = ChatService.ajouterMessage("user1", "Aziza", "Test", "SALON1");
        const id = add.message.id;

        const del = ChatService.supprimerMessage(id, "user1", false);
        expect(del.success).toBe(true);
    });

    test("Un utilisateur non admin ne peut PAS supprimer le message d'un autre", () => {
        const add = ChatService.ajouterMessage("userA", "Lina", "Secret", "SALON1");
        const id = add.message.id;

        const del = ChatService.supprimerMessage(id, "userB", false);
        expect(del.success).toBe(false);
        expect(del.error).toBe("Permission refusée.");
    });

    test("Un admin peut supprimer n'importe quel message", () => {
        const add = ChatService.ajouterMessage("userA", "Lina", "Message à supprimer", "SALON1");
        const id = add.message.id;

        const del = ChatService.supprimerMessage(id, "adminId", true); 
        expect(del.success).toBe(true);
    });

});

});
