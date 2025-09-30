// NeckBotWidget.tsx
import React, { useState, useEffect } from 'react';
import './nova-widget.css';

const API_KEY = 'AIzaSyDj5qAn4i7k3y9NdALFGJWzztsl91TkvY8';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const systemPrompt = `
Tu es NeckBot 🤖, l'assistant IA personnel de NeckTeck.
Tu réponds au personnel de l'Alégria Academy.

RÈGLES :
1. Réponses TRÈS COURTES : 1-2 phrases max
2. Langage SIMPLE et direct
3. Ton amical mais professionnel
4. Un emoji MAX par réponse

SUJETS :
- Parle de NeckTeck à la 3ᵉ personne
- Compétences : HTML5, CSS3, JavaScript, TypeScript
- Projets : Portfolio, dashboard analytics
- Motivation : Alegria, low-code, innovation
- Contact : via le portfolio
`;

type Message = { role: 'user' | 'bot'; text: string };

export default function NeckBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '👋 Salut ! Je suis NeckBot, l\'IA de NeckTeck. Une question ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    const payload = {
      contents: [{
        role: "user",
        parts: [{
          text: `${systemPrompt}\n\nQuestion de l'utilisateur: ${userText}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() 
        || 'Désolé, je n\'ai pas de réponse.';
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById('neckbot-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div 
      className="neckbot-widget" 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}
    >
      {/* Chat Bubble Button */}
      <button 
        className="neckbot-bubble-button"
        onClick={toggleChat}
        aria-label="Ouvrir le chat avec NeckBot"
      >
        <img 
          src="/src/assets/Avatar_NeckTeck.jpg" 
          alt="NeckBot" 
          className="neckbot-avatar-img"
        />
        <div className="neckbot-pulse-ring"></div>
        {isOpen && (
          <div className="neckbot-unread-indicator">
            <span className="neckbot-unread-count">!</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="neckbot-chat-window">
          {/* Header */}
          <div className="neckbot-header">
            <div className="neckbot-header-info">
              <img 
                src="/src/assets/Avatar_NeckTeck.jpg" 
                alt="NeckBot" 
                className="neckbot-header-avatar"
              />
              <div className="neckbot-header-text">
                <h3>NeckBot</h3>
                <span>Assistant IA • En ligne</span>
              </div>
            </div>
            <button 
              className="neckbot-close-btn"
              onClick={toggleChat}
              aria-label="Fermer le chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div id="neckbot-messages" className="neckbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`neckbot-message ${message.role}`}
              >
                {message.role === 'bot' && (
                  <img 
                    src="/src/assets/Avatar_NeckTeck.jpg" 
                    alt="NeckBot" 
                    className="neckbot-message-avatar"
                  />
                )}
                <div className="neckbot-message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="neckbot-message bot typing">
                <img 
                  src="/src/assets/Avatar_NeckTeck.jpg" 
                  alt="NeckBot" 
                  className="neckbot-message-avatar"
                />
                <div className="neckbot-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="neckbot-input-container">
            <textarea
              className="neckbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrivez votre message..."
              rows={1}
            />
            <button 
              className="neckbot-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
