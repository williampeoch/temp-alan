"use client";

import { useState } from 'react';
import CustomWebcam from '@/components/CustomWebcam';

export default function Home() {
  const [messages, setMessages] = useState([
    { text: 'Bonjour ! Comment puis-je vous aider aujourd’hui ?', from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '' && !imgSrc) return;

    const userMessage = { text: input, from: 'user', image: imgSrc || null };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat-example', {
        method: 'POST',
        body: JSON.stringify({
          text: input,
          image: imgSrc,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.body) {
        throw new Error('Pas de body dans la réponse');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        result += decoder.decode(value, { stream: true });

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: result, from: 'bot' },
        ]);
      }
    } catch (error) {
      console.error('Erreur dans la génération de la réponse IA :', error);
      setMessages((prev) => [
        ...prev,
        { text: "Désolé, quelque chose s'est mal passé.", from: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-center font-bold text-lg">
        Chatbot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`${
                  message.from === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                } p-3 rounded-lg max-w-xs text-white ${
                  message.from === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                }`}
              >
                {message.text}
                {/* Affichage de l'image si présente */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Image envoyée par l'utilisateur"
                    className="mt-2 max-w-full rounded-lg"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Composant CustomWebcam pour capturer une image */}
        {showWebcam && <CustomWebcam imgSrc={imgSrc} setImgSrc={setImgSrc} />}
      </div>

      {/* Input pour le message texte */}
      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>

        {/* Bouton pour afficher la webcam */}
        <button
          className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowWebcam((prev) => !prev)}
        >
          {showWebcam ? 'Masquer la webcam' : 'Ouvrir la webcam'}
        </button>
      </div>
    </div>
  );
}
