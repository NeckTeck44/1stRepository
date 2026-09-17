// Importation des modules
document.addEventListener("DOMContentLoaded", function () {
  console.log("Application démarrée");

  // Initialisation des gestionnaires d'événements
  initEventListeners();

  // Initialisation du chatbot
  initChatbot();
});

function initEventListeners() {
  // Gestionnaires d'événements communs
  console.log("Initialisation des gestionnaires d'événements");

  // Gestionnaire pour la musique
  const musicToggle = document.getElementById("musicToggle");
  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }
}

// Variables globales
let isChatbotOpen = false;
let audioContext = null;
let chatHistory = [];

// Configuration de l'API Gemini (version 1.0)
const GEMINI_API_KEY = "AIzaSyDUeQjzoSc1ExesGWhGhnxA4tYRema1-ic";

// Vérification de la clé API
if (!GEMINI_API_KEY) {
  const errorMsg = "ERREUR: Aucune clé API Gemini n'a été configurée.";
  console.error(errorMsg);
  alert(errorMsg);
}

// Configuration des endpoints
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com";
const GEMINI_API_VERSION = "v1beta";

// Configuration avec le modèle gemini-2.0-flash
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `${GEMINI_BASE_URL}/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`;

// Modèles alternatifs à essayer en cas d'échec
const FALLBACK_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
];

let currentModelIndex = 0;

// En-têtes pour les requêtes API
const API_HEADERS = {
  "Content-Type": "application/json",
  "X-goog-api-key": GEMINI_API_KEY,
};

// Fonction utilitaire pour vérifier la configuration de l'API
async function checkGeminiAPI() {
  try {
    console.log("🔍 Vérification de la configuration de l'API Gemini...");
    console.log("🔑 Clé API:", GEMINI_API_KEY ? "Définie" : "Non définie");
    console.log("🌐 URL de l'API:", GEMINI_API_URL);

    // Vérifier si la clé API est valide en testant l'endpoint des modèles
    const modelsUrl = `${GEMINI_BASE_URL}/${GEMINI_API_VERSION}/models?key=${GEMINI_API_KEY}`;
    console.log("🔗 URL de test des modèles:", modelsUrl);

    const response = await fetch(modelsUrl);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("❌ Erreur de l'API Gemini:", {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      throw new Error(
        `Erreur HTTP ${response.status}: ${JSON.stringify(error)}`
      );
    }

    const data = await response.json();
    console.log("✅ Modèles disponibles:", data);

    // Vérifier si le modèle est disponible
    const modelExists = data.models?.some((m) => m.name.includes(GEMINI_MODEL));
    console.log(
      `🔍 Le modèle '${GEMINI_MODEL}' est ${
        modelExists ? "disponible ✅" : "non disponible ❌"
      }`
    );

    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l'API Gemini:", error);
    return null;
  }
}

// Au chargement, vérifier la configuration de l'API
document.addEventListener("DOMContentLoaded", () => {
  console.log("Vérification de la configuration de l'API...");
  checkGeminiAPI().catch(console.error);
});

// Fonction utilitaire pour effectuer des requêtes fetch avec gestion d'erreur améliorée
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur HTTP ${response.status} sur ${url}`, errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur de réseau ou de traitement:", error);
    throw error;
  }
}

// Fonction pour lister les modèles disponibles
async function listAvailableModels() {
  try {
    console.log("Tentative de récupération des modèles disponibles...");
    const data = await safeFetch(
      `${GEMINI_BASE_URL}/${GEMINI_API_VERSION}/models?key=${GEMINI_API_KEY}`
    );
    console.log("Modèles disponibles:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles:", error);
    return [];
  }
}

// Au chargement de la page, lister les modèles disponibles
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Vérification des modèles disponibles...");
    listAvailableModels().catch(console.error);
  });
}

// Fonction pour essayer le modèle suivant
async function tryNextModel() {
  currentModelIndex = (currentModelIndex + 1) % FALLBACK_MODELS.length;
  const nextModel = FALLBACK_MODELS[currentModelIndex];
  console.log(`🔄 Essai du modèle suivant: ${nextModel}`);
  return nextModel;
}

// Fonction pour envoyer un message à l'API Gemini
async function sendToGemini(message, attempt = 0) {
  if (!navigator.onLine) {
    return "Erreur de connexion. Veuillez vérifier votre connexion Internet.";
  }

  // Limite le nombre de tentatives
  if (attempt >= FALLBACK_MODELS.length) {
    console.error("❌ Tous les modèles ont échoué");
    return "Désolé, aucun modèle disponible ne fonctionne actuellement. Veuillez réessayer plus tard.";
  }

  const currentModel = FALLBACK_MODELS[currentModelIndex];
  const apiUrl = `${GEMINI_BASE_URL}/${GEMINI_API_VERSION}/models/${currentModel}:generateContent`;

  try {
    console.log(`🔵 Tentative ${attempt + 1} avec le modèle: ${currentModel}`);

    // Format de la requête selon la documentation Gemini
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Tu es l'assistant de Catel, un développeur web. Tu réponds aux questions du personnel de l'Alégria School qui visite son portfolio. 
              
Tâches principales :
1. Fournir des informations sur les compétences et l'expérience de Catel
2. Répondre aux questions sur ses projets et réalisations
3. Orienter vers les bonnes sections du portfolio
4. Donner des informations sur ses disponibilités et modalités de contact

Tonalité :
- Professionnelle et courtoise
- Claire et concise
- Réactive et serviable

Informations clés sur Catel :
- Développeur web passionné
- Spécialisé en développement front-end
- Expérience avec les technologies modernes (React, Node.js, etc.)
- Capacité à travailler en équipe et à s'adapter rapidement

Si on te pose une question à laquelle tu ne peux pas répondre, propose de contacter Catel directement via les coordonnées fournies sur le site.

Message du visiteur : ${message.substring(0, 1000)}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7, // Un peu plus formel et précis
        topP: 0.9, // Moins de variété pour des réponses plus cohérentes
        topK: 40, // Plus ciblé sur la pertinence
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    };

    console.log("🌐 Envoi de la requête à:", apiUrl);
    console.log(
      "📝 Corps de la requête:",
      JSON.stringify(requestBody, null, 2)
    );

    // Configuration de la requête avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Timeout de 15 secondes

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: API_HEADERS,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let responseData;
    try {
      responseData = await response.json();
      console.log("📥 Réponse de l'API:", responseData);
    } catch (parseError) {
      console.error(
        "❌ Erreur lors de l'analyse de la réponse JSON:",
        parseError
      );
      throw new Error("Réponse invalide du serveur");
    }

    if (!response.ok) {
      console.error("❌ Erreur de l'API:", {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        model: currentModel,
      });

      if (response.status === 404) {
        console.log("🔍 Modèle non trouvé, essai du modèle suivant...");
        await tryNextModel();
        return sendToGemini(message, attempt + 1);
      }

      throw new Error(
        responseData.error?.message || `Erreur HTTP ${response.status}`
      );
    }

    // Traitement de la réponse
    let text =
      responseData.candidates?.[0]?.content?.parts?.[0]?.text ||
      responseData.predictions?.[0]?.content ||
      responseData.text ||
      "Je n'ai pas pu générer de réponse. Pouvez-vous reformuler votre question ?";

    // Nettoyer la réponse si nécessaire
    text = text.replace(/^[\s\n]+|[\s\n]+$/g, ""); // Supprime les espaces et retours à la ligne superflus

    if (text) {
      console.log("✅ Réponse reçue avec succès du modèle:", currentModel);
      return text;
    }

    console.error("❌ Format de réponse inattendu:", responseData);
    return "Désolé, je n'ai pas pu comprendre la réponse du serveur.";
  } catch (error) {
    console.error(`❌ Erreur avec le modèle ${currentModel}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // En cas d'erreur réseau, vérifier la connexion
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error(
        "❌ Erreur réseau détectée. Vérifiez votre connexion Internet."
      );
      return "Je n'arrive pas à me connecter au serveur. Pourriez-vous vérifier votre connexion Internet ?";
    }

    // En cas de timeout
    if (error.name === "AbortError") {
      console.error("⌛ La requête a expiré (timeout)");
      return "La réponse met trop de temps à arriver. Voulez-vous que je réessaye ?";
    }

    // Essayer le modèle suivant si disponible
    if (attempt < FALLBACK_MODELS.length - 1) {
      console.log("🔄 Essai du modèle suivant suite à une erreur...");
      await tryNextModel();
      return sendToGemini(message, attempt + 1);
    }

    return `Je m'excuse, mais j'ai rencontré une difficulté : ${
      error.message || "une erreur inconnue est survenue"
    }. Pourriez-vous me poser votre question d'une autre manière ?`;
  }
}

// Définition des propriétés par défaut du chat
const defaultChatState = {
  width: "350px",
  height: "600px",
  left: "",
  top: "",
  right: "20px",
  bottom: "20px",
};

// Restaurer la fenêtre à son état par défaut
function resetChatToDefault(container) {
  if (!container) return;

  container.style.width = defaultChatState.width;
  container.style.height = defaultChatState.height;
  container.style.left = defaultChatState.left;
  container.style.top = defaultChatState.top;
  container.style.right = defaultChatState.right;
  container.style.bottom = defaultChatState.bottom;
}

// ==================== FONCTIONS AUDIO ====================

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playSound(frequency, duration, type = "sine", volume = 0.1) {
  try {
    const audioCtx = initAudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Fade out pour éviter les clics
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);

    // Nettoyage
    oscillator.onended = () => {
      gainNode.disconnect();
      oscillator.disconnect();
    };
  } catch (error) {
    console.error("Erreur lors de la lecture du son:", error);
  }
}

function playOpenSound() {
  // Son d'ouverture du chatbot (arpège ascendant)
  playSound(440, 0.1, "sine", 0.1);
  setTimeout(() => playSound(554.37, 0.1, "sine", 0.1), 50);
  setTimeout(() => playSound(659.25, 0.1, "sine", 0.1), 100);
  setTimeout(() => playSound(880, 0.2, "sine", 0.1), 150);
}

function playCloseSound() {
  // Son de fermeture du chatbot (arpège descendant)
  playSound(880, 0.1, "sine", 0.1);
  setTimeout(() => playSound(659.25, 0.1, "sine", 0.1), 50);
  setTimeout(() => playSound(554.37, 0.1, "sine", 0.1), 100);
  setTimeout(() => playSound(440, 0.2, "sine", 0.1), 150);
}

function playMessageSound() {
  // Son pour l'envoi/réception de message
  playSound(800, 0.05, "triangle", 0.03);
}

function playTypingSound() {
  // Son de frappe au clavier (plus doux)
  const freq = 300 + Math.random() * 200;
  playSound(freq, 0.05, "square", 0.03);
}

// ==================== FONCTIONS DU CHATBOT ====================

function initChatbot() {
  // Vérifier si le chatbot existe déjà pour éviter les doublons
  if (document.getElementById("chatbot")) {
    console.log("Le chatbot est déjà initialisé");
    return;
  }

  // Créer le bouton de basculement du chat avec l'avatar de Neckbot
  const chatToggle = document.createElement("button");
  chatToggle.className = "chatbot-toggle";
  chatToggle.setAttribute("aria-label", "Ouvrir le chat");
  chatToggle.innerHTML = `
        <div class="chatbot-avatar">
            <img src="assets/images/NeckBot.jpg" alt="NeckBot Assistant">
            <div class="avatar-status online"></div>
        </div>
    `;
  chatToggle.onclick = toggleChatbot;
  document.body.appendChild(chatToggle);

  // Créer l'interface du chatbot
  const chatbot = document.createElement("div");
  chatbot.id = "chatbot";
  chatbot.className = "chatbot-container";
  chatbot.innerHTML = `
    <div class="chatbot-wrapper">
      <div class="chatbot-header">
        <div class="chatbot-avatar">
          <img src="assets/images/NeckBot.jpg" alt="NeckBot Assistant">
          <div class="avatar-status online"></div>
        </div>
        <div class="chatbot-info">
          <h3>NeckBot</h3>
          <span class="chatbot-subtitle">L'IA à votre service</span>
        </div>
        <button class="close-btn" aria-label="Fermer le chat">×</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="message bot-message">
          <p>Bonjour ! Je suis NeckBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?</p>
        </div>
        <div id="typing-indicator" class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="chat-input-container">
        <div class="chat-input">
          <input type="text" id="user-input" placeholder="Écrivez votre message..." 
                aria-label="Votre message" autocomplete="off">
          <button class="send-btn" aria-label="Envoyer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(chatbot);

  // Initialiser le redimensionnement
  initResize(chatbot);

  // Cacher l'indicateur de frappe par défaut
  document.getElementById("typing-indicator").style.display = "none";

  // Ajouter les écouteurs d'événements
  const closeBtn = chatbot.querySelector(".close-btn");
  const sendBtn = chatbot.querySelector(".send-btn");
  const userInput = chatbot.querySelector("#user-input");
  const header = chatbot.querySelector(".chatbot-header");
  const title = header?.querySelector("h3");
  const subtitle = header?.querySelector(".chatbot-subtitle");

  // Fonction pour mettre à jour la taille du texte en fonction de la largeur du chatbot
  function updateChatbotTextSize() {
    if (!chatbot || !title || !subtitle) return;

    const width = chatbot.offsetWidth;

    // Calculer le facteur d'échelle basé sur la largeur
    // Largeur minimale: 300px (0.9), largeur maximale: 800px (1.3)
    const minSize = 0.9; // Taille de base plus raisonnable
    const maxSize = 1.3;
    const scale =
      minSize +
      ((Math.min(800, Math.max(300, width)) - 300) * (maxSize - minSize)) / 500;

    // Appliquer les tailles avec unité rem
    title.style.cssText = `
      font-size: ${(1.15 * scale).toFixed(2)}rem !important; 
      line-height: 1.25 !important;
    `;

    subtitle.style.cssText = `
      font-size: ${(0.9 * scale).toFixed(2)}rem !important;
      line-height: 1.35 !important;
    `;

    // Forcer le recalcul des styles
    void title.offsetHeight;
  }

  // Mettre à jour la taille du texte au chargement
  updateChatbotTextSize();

  // Observer les changements de taille du chatbot
  const resizeObserver = new ResizeObserver(updateChatbotTextSize);
  if (chatbot) {
    resizeObserver.observe(chatbot);
  }

  // Nettoyer l'observer à la fermeture
  const originalCloseChatbot = closeChatbot;
  closeChatbot = function () {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    originalCloseChatbot();
  };

  // Mettre à jour également lors du redimensionnement manuel
  const originalOnMouseMove = document.onmousemove;
  document.onmousemove = function (e) {
    if (originalOnMouseMove) originalOnMouseMove(e);
    updateChatbotTextSize();
  };

  closeBtn.addEventListener("click", closeChatbot);
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Activer le déplacement de la fenêtre
  initDrag(chatbot, header);

  // Gestion du clic en dehors pour fermer le chatbot
  function handleOutsideClick(event) {
    const isClickInside =
      chatbot.contains(event.target) || chatToggle.contains(event.target);

    if (!isClickInside && isChatbotOpen) {
      // Vérifier si c'est une sélection de texte
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        return;
      }

      // Vérifier si le clic est sur un élément interactif
      if (event.target.closest("button, a, input, textarea, select")) {
        return;
      }

      closeChatbot();
    }
  }

  // Ajouter l'écouteur de clic en dehors
  document.addEventListener("mousedown", handleOutsideClick);

  // Sauvegarder les références originales
  const originalCloseChatbotFn = closeChatbot;
  const originalOpenChatbot = openChatbot;

  // Surcharger closeChatbot pour gérer à la fois le ResizeObserver et le clic en dehors
  closeChatbot = function () {
    originalCloseChatbotFn();
    document.removeEventListener("mousedown", handleOutsideClick);
  };

  // Surcharger openChatbot
  openChatbot = function () {
    originalOpenChatbot();
    document.addEventListener("mousedown", handleOutsideClick);
  };

  // Empêcher la propagation du clic à l'intérieur du chatbot
  chatbot.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Initialiser le glisser-déposer
  header.style.cursor = "grab";

  header.addEventListener("mousedown", function (e) {
    // Ne pas démarrer le déplacement si on clique sur un bouton ou un lien
    if (e.target.closest("button, a, input, textarea, select")) {
      return;
    }

    // Démarrer le déplacement
    initDrag(chatbot, header);
  });
}

function toggleChatbot() {
  if (!isChatbotOpen) {
    openChatbot();
  } else {
    closeChatbot();
  }
}

function openChatbot() {
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.querySelector(".chatbot-toggle");
  if (!chatbot || !chatToggle) return;

  // Réinitialiser la position et la taille
  resetChatToDefault(chatbot);

  // Afficher la fenêtre et cacher le bouton avec animation
  chatbot.style.display = "flex";
  chatToggle.classList.add("bubble-hidden");
  isChatbotOpen = true;

  // Forcer un recalcul du style pour s'assurer que les transitions fonctionnent
  void chatbot.offsetHeight;

  // Ajouter la classe visible pour l'animation
  chatbot.classList.add("visible");

  // Jouer le son d'ouverture
  playOpenSound();

  // Mettre le focus sur le champ de saisie
  setTimeout(() => {
    const input = document.getElementById("user-input");
    if (input) input.focus();
  }, 50);
}

function closeChatbot() {
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.querySelector(".chatbot-toggle");
  if (!chatbot || !chatToggle) return;

  // Retirer la classe visible pour l'animation de fermeture
  chatbot.classList.remove("visible");
  isChatbotOpen = false;

  // Réafficher le bouton avec animation
  chatToggle.classList.remove("bubble-hidden");

  // Attendre la fin de l'animation avant de masquer complètement
  setTimeout(() => {
    if (!isChatbotOpen) {
      chatbot.style.display = "none";
    }
  }, 300); // Doit correspondre à la durée de la transition CSS

  // Jouer le son de fermeture
  playCloseSound();
}

function showTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (!typingIndicator) return;

  typingIndicator.style.display = "flex";
  const messagesContainer = document.getElementById("chat-messages");
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.style.display = "none";
  }
}

function addMessage(text, isUser = false) {
  const messagesContainer = document.getElementById("chat-messages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;

  // Si c'est un message utilisateur, l'ajouter directement
  if (isUser) {
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
  } else {
    // Pour les messages du bot, utiliser l'effet de frappe
    messagesContainer.appendChild(messageDiv);
    typeMessage(messageDiv, text);
  }

  // Faire défiler vers le bas
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Jouer le son de message
  playMessageSound();
}

function typeMessage(element, text, index = 0) {
  if (index < text.length) {
    // Mettre à jour le texte progressivement
    element.innerHTML = `<p>${text.substring(0, index + 1)}</p>`;

    // Jouer un son de frappe occasionnellement
    if (index % 3 === 0) {
      playTypingSound();
    }

    // Continuer l'effet de frappe
    setTimeout(
      () => typeMessage(element, text, index + 1),
      10 + Math.random() * 20
    );
  } else {
    element.textContent = text;
    hideTypingIndicator();
  }
}

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();

  if (message === "") return;

  // Ajouter le message de l'utilisateur
  addMessage(message, true);
  userInput.value = "";

  // Désactiver le champ de saisie pendant le traitement
  userInput.disabled = true;

  // Afficher l'indicateur de frappe
  showTypingIndicator();

  try {
    // Envoyer le message à l'API Gemini
    const botResponse = await sendToGemini(message);

    // Masquer l'indicateur de frappe
    hideTypingIndicator();

    // Ajouter la réponse du bot
    addMessage(botResponse, false);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    hideTypingIndicator();
    addMessage("Désolé, une erreur est survenue. Veuillez réessayer.", false);
  } finally {
    // Réactiver le champ de saisie
    userInput.disabled = false;
    userInput.focus();
  }
}

function addMessage(text, isUser = false) {
  const messagesContainer = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;

  const messageContent = document.createElement("p");
  messageContent.textContent = text;

  messageDiv.appendChild(messageContent);
  messagesContainer.appendChild(messageDiv);

  // Faire défiler vers le bas pour voir le nouveau message
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Jouer un son de message
  if (!isUser) {
    playMessageSound();
  }
}

function getBotResponse(message) {
  // Convertir le message en minuscules pour une correspondance insensible à la casse
  const msg = message.toLowerCase();

  // Réponses prédéfinies
  if (
    msg.includes("bonjour") ||
    msg.includes("salut") ||
    msg.includes("coucou")
  ) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  } else if (msg.includes("ça va") || msg.includes("comment ça va")) {
    return "Je vais très bien, merci de demander ! Et vous ?";
  } else if (msg.includes("merci") || msg.includes("merci beaucoup")) {
    return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
  } else if (msg.includes("au revoir") || msg.includes("à bientôt")) {
    return "Au revoir ! Passez une excellente journée !";
  } else if (msg.includes("aide") || msg.includes("aider")) {
    return "Je peux vous aider à en savoir plus sur mes compétences et mes projets. Posez-moi des questions !";
  } else if (msg.includes("compétence") || msg.includes("sais faire")) {
    return "Je suis compétent en développement web, programmation, et bien plus encore. Consultez la section 'Compétences' pour plus de détails !";
  } else if (msg.includes("projet") || msg.includes("travail")) {
    return "J'ai travaillé sur plusieurs projets intéressants. Jetez un œil à la section 'Projets' pour en savoir plus !";
  } else if (msg.includes("contact") || msg.includes("contacter")) {
    return "Vous pouvez me contacter via le formulaire de contact ou en cliquant sur les icônes de réseaux sociaux dans la section 'Contact'.";
  } else if (msg.includes("nom") || msg.includes("t'appelles")) {
    return "Je suis NeckBot, votre assistant virtuel personnel. Ravi de faire votre connaissance !";
  } else if (msg.includes("âge") || msg.includes("vieux")) {
    return "En tant qu'assistant virtuel, je n'ai pas d'âge. Je suis là pour vous aider 24h/24 !";
  } else if (msg.includes("météo") || msg.includes("temps")) {
    return "Je ne peux pas vérifier la météo, mais je peux vous aider avec des informations sur mes compétences et projets !";
  } else if (msg.includes("blague") || msg.includes("rigoler")) {
    const jokes = [
      "Pourquoi les développeurs détestent la nature ? Parce qu'il y a trop de bugs !",
      "Quelle est la différence entre un développeur et un chat ? Aucun des deux ne fait ce que vous voulez quand vous le leur demandez.",
      "Comment appelle-t-on un développeur qui ne prend pas de pause ? Un code en pause !",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else if (msg.includes("heure")) {
    return `Il est actuellement ${new Date().toLocaleTimeString("fr-FR")}.`;
  } else if (msg.includes("date")) {
    return `Nous sommes le ${new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}.`;
  } else if (msg.includes("musique") || msg.includes("son")) {
    return "Vous pouvez activer ou désactiver la musique d'ambiance en cliquant sur l'icône de note de musique en haut à droite de l'écran.";
  } else if (msg.includes("couleur") || msg.includes("préférée")) {
    return "Ma couleur préférée est le bleu, comme le thème de cette page !";
  } else if (msg.length < 3) {
    return "Je n'ai pas bien compris. Pourriez-vous être plus précis ?";
  } else {
    // Réponse par défaut si aucune correspondance n'est trouvée
    const defaultResponses = [
      "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?",
      "Je n'ai pas d'information à ce sujet. Essayez de poser une question différente.",
      "Je suis désolé, je n'ai pas de réponse à cette question. En quoi puis-je vous aider d'autre ?",
      "Je ne suis pas programmé pour répondre à cela. Essayez de me poser une question sur mes compétences ou mes projets !",
    ];
    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }
}

// ==================== FONCTIONS DE GESTION DE LA MUSIQUE ====================

function toggleMusic() {
  const music = document.getElementById("background-music");
  const musicToggle = document.getElementById("musicToggle");

  if (!music || !musicToggle) return;

  if (music.paused) {
    // Démarrer la musique
    music.play().catch((error) => {
      console.error("Erreur lors de la lecture de la musique:", error);
      // Si l'autoplay a échoué, initialiser l'audio au prochain clic utilisateur
      initAudioOnFirstInteraction();
    });
    musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    musicToggle.setAttribute("aria-label", "Couper la musique");
    musicToggle.title = "Couper la musique";
  } else {
    // Mettre en pause la musique
    music.pause();
    musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    musicToggle.setAttribute("aria-label", "Activer la musique");
    musicToggle.title = "Activer la musique";
  }
}

// Initialiser le contexte audio au premier clic utilisateur
function initAudioOnFirstInteraction() {
  // Vérifier si l'utilisateur a déjà interagi avec la page
  if (window.userHasInteracted) return;

  // Fonction pour initialiser l'audio
  const initAudio = () => {
    window.userHasInteracted = true;

    // Initialiser le contexte audio
    initAudioContext();

    // Démarrer la musique si elle n'est pas déjà en cours de lecture
    const music = document.getElementById("background-music");
    if (music && music.paused) {
      music.play().catch((error) => {
        console.error("Erreur lors de la lecture de la musique:", error);
      });
    }

    // Supprimer les écouteurs après la première interaction
    document.removeEventListener("click", initAudio);
    document.removeEventListener("keydown", initAudio);
  };

  // Ajouter les écouteurs pour la première interaction
  document.addEventListener("click", initAudio, { once: true });
  document.addEventListener("keydown", initAudio, { once: true });
}

// Initialiser l'audio et le chatbot au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM entièrement chargé, initialisation...");

  // Initialiser l'audio
  initAudioOnFirstInteraction();

  // Initialiser le chatbot avec un léger délai pour s'assurer que le DOM est prêt
  setTimeout(() => {
    console.log("Initialisation du chatbot...");
    initChatbot();

    // Vérifier si le bouton de basculement du chat a été créé
    const chatToggle = document.querySelector(".chatbot-toggle");
    if (!chatToggle) {
      console.error("Échec de l'initialisation du bouton du chatbot");
    } else {
      console.log("Bouton du chatbot initialisé avec succès");
    }
  }, 100);
});

// Écouter également l'événement load au cas où DOMContentLoaded serait déjà passé
window.addEventListener("load", function () {
  console.log("Page entièrement chargée, vérification du chatbot...");
  const chatToggle = document.querySelector(".chatbot-toggle");
  if (!chatToggle) {
    console.log(
      "Le bouton de basculement du chat n'existe toujours pas, tentative d'initialisation..."
    );
    initChatbot();
  }
});

// Exporter les fonctions pour qu'elles soient accessibles globalement
window.toggleMusic = toggleMusic;
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.closeChatbot = closeChatbot;

// Initialiser le chatbot après le chargement complet de la page
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}

// Fonction pour gérer le redimensionnement du chatbot par le coin supérieur gauche
function initResize(container) {
  const minWidth = 300;
  const minHeight = 400;
  const padding = 20; // Marge minimale par rapport aux bords de l'écran

  // Création du style pour le coin de redimensionnement
  const style = document.createElement("style");
  style.textContent = `
    .resize-handle {
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      cursor: nwse-resize;
      z-index: 1000;
      background: linear-gradient(135deg, #00ff41 50%, transparent 50%);
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .resize-handle:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // Ajouter le coin de redimensionnement
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";
  container.style.position = "relative";
  container.appendChild(resizeHandle);

  let isResizing = false;
  let rafId = null;
  let startX, startY, startWidth, startHeight;

  // Cache pour les dimensions
  const dimensions = {
    minWidth: 300,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: () => window.innerHeight - 40,
    maxLeft: () => window.innerWidth - container.offsetWidth - 10,
  };

  // Fonction pour initialiser le redimensionnement avec transformations CSS
  function initResize(container, resizeHandle) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    // Activer l'accélération matérielle
    container.style.willChange = "width, height, left, top";

    function handleMove(e) {
      if (!isResizing) return;

      // Calculer le décalage
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Calculer les nouvelles dimensions
      let newWidth = startWidth - dx;
      let newHeight = startHeight - dy;

      // Appliquer les contraintes
      newWidth = Math.max(
        dimensions.minWidth,
        Math.min(dimensions.maxWidth, newWidth)
      );
      newHeight = Math.max(
        dimensions.minHeight,
        Math.min(dimensions.maxHeight(), newHeight)
      );

      // Mettre à jour la taille et la position en une seule opération
      requestAnimationFrame(() => {
        container.style.width = newWidth + "px";
        container.style.height = newHeight + "px";
        container.style.left = startLeft + (startWidth - newWidth) + "px";
      });
    }

    function startResize(e) {
      if (e.button !== 0) return;

      // Préparer pour le redimensionnement
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = container.offsetWidth;
      startHeight = container.offsetHeight;
      const rect = container.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      // Optimisations de performance
      document.body.style.userSelect = "none";
      document.body.style.cursor = "nwse-resize";

      // Utiliser une fonction nommée pour pouvoir la supprimer plus tard
      function handleUp() {
        isResizing = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        container.style.willChange = "auto";
      }

      // Ajouter les écouteurs
      document.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("mouseup", handleUp, { once: true });

      e.preventDefault();
      e.stopPropagation();
    }

    // Configuration de la poignée
    Object.assign(resizeHandle.style, {
      cursor: "nwse-resize",
      touchAction: "none",
      userSelect: "none",
      webkitUserSelect: "none",
      msUserSelect: "none",
      mozUserSelect: "none",
      position: "absolute",
      left: "0",
      top: "0",
    });

    // Ajouter l'écouteur d'événement
    resizeHandle.addEventListener("mousedown", startResize);

    // Forcer la mise à jour de la position après le rendu
    requestAnimationFrame(() => {
      resizeHandle.style.left = "0";
      resizeHandle.style.top = "0";
    });
  }

  // Initialiser le redimensionnement
  initResize(container, resizeHandle);
}

// Fonction pour gérer le déplacement de la fenêtre
function initDrag(container, header) {
  let isDragging = false;
  let offsetX, offsetY;
  const minLeft = 0;
  const minTop = 0;

  // Position initiale absolue si non définie
  if (!container.style.left) {
    container.style.left =
      window.innerWidth - container.offsetWidth - 20 + "px";
    container.style.top = "20px";
  }

  container.style.position = "fixed";
  container.style.right = "auto";
  container.style.bottom = "auto";

  function startDrag(e) {
    // Ne pas démarrer le déplacement si on clique sur un bouton ou un lien
    if (e.target.closest("button, a, input, textarea, select")) {
      return;
    }

    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    container.style.cursor = "grabbing";
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag, { once: true });

    e.preventDefault();
    e.stopPropagation();
  }

  function onDrag(e) {
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Limiter aux bords de l'écran
    const maxLeft = window.innerWidth - container.offsetWidth - 10;
    const maxTop = window.innerHeight - container.offsetHeight - 10;

    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    newTop = Math.max(minTop, Math.min(maxTop, newTop));

    container.style.left = newLeft + "px";
    container.style.top = newTop + "px";
    container.style.right = "auto";
    container.style.bottom = "auto";
  }

  function stopDrag() {
    isDragging = false;
    header.style.cursor = "grab";
    document.removeEventListener("mousemove", onDrag);
  }

  // Empêcher la sélection de texte pendant le déplacement
  header.style.userSelect = "none";
  header.style.webkitUserSelect = "none";

  // Gestion des événements de la souris
  header.addEventListener("mousedown", startDrag);

  // Style du header pour indiquer qu'il est déplaçable
  header.style.cursor = "grab";

  header.addEventListener("mouseenter", () => {
    if (!isDragging) header.style.cursor = "grab";
  });

  header.addEventListener("mouseleave", () => {
    if (!isDragging) header.style.cursor = "";
  });
}
