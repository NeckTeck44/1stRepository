// Chatbot Manager - Gestion centralisée du chatbot
console.log('🤖 Chatbot Manager chargé');

/**
 * Classe de gestion du chatbot
 */
class ChatbotManager {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.messages = [];
    this.messageHistory = [];
    this.maxHistory = ConfigUtils.get('chatbot.maxHistory') || 10;
    this.typingSpeed = ConfigUtils.get('chatbot.typingSpeed') || 30;
    this.autoCloseDelay = ConfigUtils.get('chatbot.autoCloseDelay') || 30000;
    this.autoCloseTimer = null;
    
    // Configuration API
    this.apiEndpoint = ConfigUtils.get('chatbot.apiEndpoint');
    this.apiKey = ConfigUtils.get('chatbot.apiKey');
    this.systemPrompt = ConfigUtils.get('chatbot.systemPrompt');
    this.maxTokens = ConfigUtils.get('chatbot.maxTokens') || 1000;
    this.temperature = ConfigUtils.get('chatbot.temperature') || 0.7;
    
    // Éléments DOM
    this.elements = {
      container: null,
      toggle: null,
      close: null,
      messages: null,
      input: null,
      sendButton: null,
      typingIndicator: null
    };
    
    this.init();
  }

  /**
   * Initialise le gestionnaire de chatbot
   */
  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupChatbot());
    } else {
      this.setupChatbot();
    }
  }

  /**
   * Configure le chatbot
   */
  setupChatbot() {
    try {
      // Récupérer les éléments DOM
      this.elements = {
        container: document.querySelector(Selectors.chatbot.container),
        toggle: document.querySelector(Selectors.chatbot.toggle),
        close: document.querySelector(Selectors.chatbot.close),
        messages: document.querySelector(Selectors.chatbot.messages),
        input: document.querySelector(Selectors.chatbot.input),
        sendButton: document.querySelector(Selectors.chatbot.sendButton),
        typingIndicator: document.querySelector(Selectors.chatbot.typingIndicator)
      };
      
      // Vérifier si les éléments existent
      if (!this.elements.container) {
        console.warn('⚠️ Conteneur de chatbot non trouvé, le chatbot ne sera pas initialisé');
        return;
      }
      
      // Configurer les événements
      this.setupEventListeners();
      
      // Ajouter le message de bienvenue
      this.addBotMessage(Messages.chatbot.welcome);
      
      console.log('✅ Chatbot Manager initialisé');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du chatbot:', error);
    }
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Bouton toggle
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener('click', () => this.toggle());
    }
    
    // Bouton close
    if (this.elements.close) {
      this.elements.close.addEventListener('click', () => this.close());
    }
    
    // Bouton send
    if (this.elements.sendButton) {
      this.elements.sendButton.addEventListener('click', () => this.sendMessage());
    }
    
    // Input field
    if (this.elements.input) {
      this.elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
      
      this.elements.input.addEventListener('input', () => {
        this.resetAutoCloseTimer();
      });
    }
    
    // Événements personnalisés
    document.addEventListener(Events.chatbot.open, () => this.handleExternalOpen());
    document.addEventListener(Events.chatbot.close, () => this.handleExternalClose());
  }

  /**
   * Ouvre le chatbot
   */
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.elements.container.classList.add(Classes.chatbot.open);
    
    // Focus sur l'input
    setTimeout(() => {
      if (this.elements.input) {
        this.elements.input.focus();
      }
    }, 300);
    
    // Démarrer le timer de fermeture automatique
    this.startAutoCloseTimer();
    
    // Émettre un événement
    this.dispatchEvent('open');
    
    // Jouer un son d'ouverture
    if (window.playNotificationSound) {
      window.playNotificationSound();
    }
    
    console.log('🤖 Chatbot ouvert');
  }

  /**
   * Ferme le chatbot
   */
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.elements.container.classList.remove(Classes.chatbot.open);
    
    // Arrêter le timer de fermeture automatique
    this.stopAutoCloseTimer();
    
    // Émettre un événement
    this.dispatchEvent('close');
    
    // Jouer un son de fermeture
    if (window.playClickSound) {
      window.playClickSound();
    }
    
    console.log('🤖 Chatbot fermé');
  }

  /**
   * Bascule l'état du chatbot
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Envoie un message
   * @param {string} messageText - Texte du message (optionnel)
   */
  sendMessage(messageText = null) {
    const text = messageText || this.elements.input?.value.trim();
    
    if (!text) return;
    
    // Ajouter le message utilisateur
    this.addUserMessage(text);
    
    // Vider l'input
    if (this.elements.input) {
      this.elements.input.value = '';
    }
    
    // Réinitialiser le timer de fermeture automatique
    this.resetAutoCloseTimer();
    
    // Générer une réponse
    this.generateBotResponse(text);
    
    // Émettre un événement
    this.dispatchEvent('message', { type: 'user', text });
  }

  /**
   * Ajoute un message utilisateur
   * @param {string} text - Texte du message
   */
  addUserMessage(text) {
    const message = {
      type: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    this.messages.push(message);
    this.messageHistory.push(message);
    
    // Limiter l'historique
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory.shift();
    }
    
    this.renderMessage(message);
    this.scrollToBottom();
  }

  /**
   * Ajoute un message bot
   * @param {string} text - Texte du message
   * @param {boolean} typing - Effet de frappe
   */
  addBotMessage(text, typing = true) {
    const message = {
      type: 'bot',
      text: text,
      timestamp: Date.now()
    };
    
    this.messages.push(message);
    this.messageHistory.push(message);
    
    // Limiter l'historique
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory.shift();
    }
    
    if (typing) {
      this.renderTypingMessage(message);
    } else {
      this.renderMessage(message);
      this.scrollToBottom();
    }
  }

  /**
   * Affiche un message avec effet de frappe
   * @param {Object} message - Objet message
   */
  renderTypingMessage(message) {
    if (!this.elements.messages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `${Classes.chatbot.message} ${Classes.chatbot.botMessage}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    messageContent.appendChild(messageText);
    messageElement.appendChild(messageContent);
    this.elements.messages.appendChild(messageElement);
    
    // Effet de frappe
    this.typeWriter(messageText, message.text, () => {
      this.scrollToBottom();
    });
    
    // Jouer un son de frappe
    if (window.playTypingSound) {
      window.playTypingSound();
    }
  }

  /**
   * Affiche un message
   * @param {Object} message - Objet message
   */
  renderMessage(message) {
    if (!this.elements.messages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `${Classes.chatbot.message} ${message.type === 'user' ? Classes.chatbot.userMessage : Classes.chatbot.botMessage}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = message.text;
    
    messageContent.appendChild(messageText);
    messageElement.appendChild(messageContent);
    this.elements.messages.appendChild(messageElement);
  }

  /**
   * Effet de frappe pour le texte
   * @param {HTMLElement} element - Élément cible
   * @param {string} text - Texte à afficher
   * @param {Function} callback - Fonction de rappel
   */
  typeWriter(element, text, callback) {
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        
        // Jouer un son de frappe
        if (index % 3 === 0 && window.playTypingSound) {
          window.playTypingSound();
        }
        
        setTimeout(type, this.typingSpeed);
      } else {
        if (callback) callback();
      }
    };
    
    type();
  }

  /**
   * Génère une réponse du bot
   * @param {string} userMessage - Message de l'utilisateur
   */
  async generateBotResponse(userMessage) {
    this.showTypingIndicator();
    this.isTyping = true;
    
    try {
      // Préparer le contexte de conversation
      const conversationContext = this.messageHistory
        .slice(-6) // Derniers 6 messages
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      const prompt = `${this.systemPrompt}\n\nConversation récente:\n${conversationContext}\n\nUser: ${userMessage}\nAssistant:`;
      
      // Appeler l'API
      const response = await this.callAPI(prompt);
      
      this.hideTypingIndicator();
      this.isTyping = false;
      
      if (response) {
        this.addBotMessage(response);
        this.dispatchEvent('response', { userMessage, botResponse: response });
      } else {
        this.addBotMessage(Messages.chatbot.error);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la réponse:', error);
      this.hideTypingIndicator();
      this.isTyping = false;
      this.addBotMessage(Messages.chatbot.error);
    }
    
    this.resetAutoCloseTimer();
  }

  /**
   * Appelle l'API Gemini
   * @param {string} prompt - Prompt à envoyer
   * @returns {Promise<string>}
   */
  async callAPI(prompt) {
    if (!this.apiKey || !this.apiEndpoint) {
      console.warn('⚠️ Clé API ou endpoint non configuré');
      return 'Désolé, le service de chatbot n\'est pas configuré correctement.';
    }
    
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.temperature,
            topK: 1,
            topP: 1,
            maxOutputTokens: this.maxTokens,
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('Réponse API invalide');
      }
      
    } catch (error) {
      console.error('❌ Erreur API:', error);
      throw error;
    }
  }

  /**
   * Affiche l'indicateur de frappe
   */
  showTypingIndicator() {
    if (this.elements.typingIndicator) {
      this.elements.typingIndicator.style.display = 'block';
      this.scrollToBottom();
    }
    
    this.dispatchEvent('typing', { isTyping: true });
  }

  /**
   * Cache l'indicateur de frappe
   */
  hideTypingIndicator() {
    if (this.elements.typingIndicator) {
      this.elements.typingIndicator.style.display = 'none';
    }
    
    this.dispatchEvent('typing', { isTyping: false });
  }

  /**
   * Défile vers le bas du chat
   */
  scrollToBottom() {
    if (this.elements.messages) {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
  }

  /**
   * Démarre le timer de fermeture automatique
   */
  startAutoCloseTimer() {
    this.stopAutoCloseTimer();
    
    this.autoCloseTimer = setTimeout(() => {
      if (this.isOpen && !this.isTyping) {
        this.close();
      }
    }, this.autoCloseDelay);
  }

  /**
   * Arrête le timer de fermeture automatique
   */
  stopAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  /**
   * Réinitialise le timer de fermeture automatique
   */
  resetAutoCloseTimer() {
    if (this.isOpen) {
      this.startAutoCloseTimer();
    }
  }

  /**
   * Gère l'ouverture externe
   */
  handleExternalOpen() {
    if (!this.isOpen) {
      this.open();
    }
  }

  /**
   * Gère la fermeture externe
   */
  handleExternalClose() {
    if (this.isOpen) {
      this.close();
    }
  }

  /**
   * Efface l'historique des messages
   */
  clearHistory() {
    this.messages = [];
    this.messageHistory = [];
    
    if (this.elements.messages) {
      this.elements.messages.innerHTML = '';
    }
    
    // Ajouter le message de bienvenue
    this.addBotMessage(Messages.chatbot.welcome, false);
    
    console.log('🗑️ Historique du chatbot effacé');
  }

  /**
   * Obtient l'historique des messages
   * @returns {Array}
   */
  getHistory() {
    return [...this.messageHistory];
  }

  /**
   * Définit la vitesse de frappe
   * @param {number} speed - Vitesse en millisecondes
   */
  setTypingSpeed(speed) {
    this.typingSpeed = Math.max(10, speed);
    console.log(`⌨️ Vitesse de frappe définie à ${this.typingSpeed}ms`);
  }

  /**
   * Définit le délai de fermeture automatique
   * @param {number} delay - Délai en millisecondes
   */
  setAutoCloseDelay(delay) {
    this.autoCloseDelay = Math.max(5000, delay);
    console.log(`⏱️ Délai de fermeture automatique défini à ${this.autoCloseDelay}ms`);
  }

  /**
   * Définit le nombre maximum de messages dans l'historique
   * @param {number} max - Nombre maximum
   */
  setMaxHistory(max) {
    this.maxHistory = Math.max(1, max);
    console.log(`📝 Historique maximum défini à ${this.maxHistory} messages`);
  }

  /**
   * Émet un événement du chatbot
   * @param {string} type - Type d'événement
   * @param {Object} data - Données de l'événement
   */
  dispatchEvent(type, data = {}) {
    const event = new CustomEvent(Events.chatbot[type], {
      detail: { ...data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Obtient l'état actuel du chatbot
   * @returns {Object}
   */
  getStatus() {
    return {
      isOpen: this.isOpen,
      isTyping: this.isTyping,
      messagesCount: this.messages.length,
      historyCount: this.messageHistory.length,
      typingSpeed: this.typingSpeed,
      autoCloseDelay: this.autoCloseDelay,
      maxHistory: this.maxHistory,
      apiConfigured: !!(this.apiKey && this.apiEndpoint)
    };
  }
}

// Créer une instance globale
let chatbotManager;

// Initialiser le gestionnaire de chatbot quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  chatbotManager = new ChatbotManager();
  window.chatbotManager = chatbotManager;
});

// Exporter les fonctions globales pour la compatibilité
window.openChatbot = () => chatbotManager?.open();
window.closeChatbot = () => chatbotManager?.close();
window.toggleChatbot = () => chatbotManager?.toggle();
window.sendChatMessage = (message) => chatbotManager?.sendMessage(message);
window.clearChatHistory = () => chatbotManager?.clearHistory();
window.getChatHistory = () => chatbotManager?.getHistory();
window.getChatbotStatus = () => chatbotManager?.getStatus();

console.log('🤖 Chatbot Manager prêt à être initialisé');
