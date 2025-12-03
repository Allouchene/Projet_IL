// services/messagesStorage.js

const STORAGE_KEY = "messages";

// Récupérer les messages
export function getMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Sauvegarder les messages
export function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Ajouter un message
export function addMessage(message) {
    const current = getMessages();
    const updated = [...current, message];
    saveMessages(updated);
    return updated;
}

// Vider tous les messages si besoin
export function clearMessages() {
    localStorage.removeItem(STORAGE_KEY);
}