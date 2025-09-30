// NeckBotChat.tsx
import React, { useState } from 'react';
import './nova.css';

const API_KEY = 'AIzaSyDj5qAn4i7k3y9NdALFGJWzztsl91TkvY8';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const systemPrompt = `
Tu es NeckBot 🤖, l'assistant IA personnel de NeckTeck.
Tu réponds au personnel de l'Alégria Academy.

STYLE VISUEL :
- Avatar : humanoïde digital Matrix, yeux lumineux, symbole frontal
- Ambiance : terminal futuriste, fond sombre, flux de données verts
- Ton : professionnel, bienveillant, direct
- Typo : Orbitron (titres), Source Code Pro (texte)
- Couleurs : noir, vert néon, gris clair

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

export default function NeckBotChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '👁️ Bonjour, je suis NeckBot. Posez votre question.' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    const payload = {
      prompt: systemPrompt + `\nUtilisateur : ${userText}\nIA :`,
      temperature: 0.5,
      maxOutputTokens: 128
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const botReply = data.candidates?.[0]?.content?.trim() 
        || 'Désolé, je n'ai pas de réponse.';
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion.' }]);
    }
  };

  return (
    <div className="nova-container">
      <header className="nova-header">
        <img src="/assets/nova-avatar.jpg" alt="NeckBot Avatar" className="nova-avatar" />
        <h1 className="nova-title">NeckBot</h1>
        <p className="nova-tagline">Assistant IA de NeckTeck pour l'Alégria Academy</p>
      </header>

      <div className="nova-chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`nova-message ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="nova-input-group">
        <input
          className="nova-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Posez votre question..."
        />
        <button className="nova-send" onClick={sendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
