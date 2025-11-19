'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';
import GalaxyBackground from './GalaxyBackground';
import TaskList from './TaskList';

export default function Chat() {
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error,
    setInput,
    stop,
    setMessages
  } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Error en el chat:', error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    stop();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const reformulateMessage = () => {
    const reformulatePrompt = "Explícalo de forma más simple y clara";
    setInput(reformulatePrompt);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const sendExampleMessage = (message: string) => {
    setInput(message);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className="flex h-screen relative overflow-hidden">
      <GalaxyBackground />
      
      <div className="flex flex-col w-80 p-4 pt-6 overflow-y-auto relative z-10 border-r border-purple-500/20">
        <TaskList />
      </div>

      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/20">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-2xl">
              AI Todo Manager
            </h1>
          </div>
        </div>
      
      {messages.length > 0 && (
        <button
          onClick={handleNewChat}
          className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-xl border border-white/20 text-sm"
          title="Iniciar nueva conversación"
        >
          Nuevo Chat
        </button>
      )}

      <div className="flex-1 overflow-y-auto p-4 pt-24 pb-8 space-y-4 max-w-3xl mx-auto w-full relative z-10 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center mt-16 animate-fadeIn px-4">
            <div className="text-6xl mb-4 animate-bounce drop-shadow-2xl">📝</div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
              ¡Bienvenido a AI Todo Manager!
            </h2>
            <p className="text-gray-200 text-base mb-6 drop-shadow-md">
              Consulta tus tareas. Gestiónalas con el panel lateral ➕
            </p>
            <p className="text-gray-400 text-xs mb-6 drop-shadow-md">
              💡 Nota: Las tareas se guardan temporalmente. Recréalas si reinicias el servidor.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
              <button 
                onClick={() => sendExampleMessage("¿Cuáles tareas me faltan por hacer?")}
                className="bg-gradient-to-br from-blue-500/80 to-purple-500/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left"
              >
                <p className="text-sm text-white font-medium drop-shadow-md">
                  ❓ "¿Cuáles tareas me faltan por hacer?"
                </p>
              </button>
              <button 
                onClick={() => sendExampleMessage("Dame un resumen de mis tareas")}
                className="bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left"
              >
                <p className="text-sm text-white font-medium drop-shadow-md">
                  📊 "Dame un resumen de mis tareas"
                </p>
              </button>
              <button 
                onClick={() => sendExampleMessage("¿Qué tareas ya completé?")}
                className="bg-gradient-to-br from-green-500/80 to-teal-500/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left"
              >
                <p className="text-sm text-white font-medium drop-shadow-md">
                  ✅ "¿Qué tareas ya completé?"
                </p>
              </button>
              <button 
                onClick={() => sendExampleMessage("¿Tengo tareas urgentes?")}
                className="bg-gradient-to-br from-orange-500/80 to-red-500/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left"
              >
                <p className="text-sm text-white font-medium drop-shadow-md">
                  🔥 "¿Tengo tareas urgentes?"
                </p>
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fadeIn flex-col ${message.role === 'assistant' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xl transition-all hover:shadow-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md text-white border border-white/20'
                  : 'bg-white/95 backdrop-blur-md text-gray-800 border border-gray-200/50 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`text-xl flex-shrink-0 ${
                  message.role === 'user' ? 'bg-white/20' : 'bg-gradient-to-br from-purple-100 to-blue-100'
                } rounded-full w-8 h-8 flex items-center justify-center shadow-md`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="flex-1 whitespace-pre-wrap break-words pt-0.5 text-sm">
                  {message.content}
                </div>
              </div>
            </div>
            
            {message.role === 'assistant' && !isLoading && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className="px-3 py-1.5 bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all hover:scale-105 shadow-md border border-gray-200/50"
                  title="Copiar respuesta"
                >
                  {copiedId === message.id ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={reformulateMessage}
                  className="px-3 py-1.5 bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all hover:scale-105 shadow-md border border-gray-200/50"
                  title="Pedir explicación más simple"
                >
                  Reformular
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-gray-200/50 flex items-center gap-2">
              <div className="text-xl bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                🤖
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-md border-2 border-white/20 text-white px-5 py-4 rounded-2xl shadow-2xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 shadow-md">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="font-bold text-lg drop-shadow-md">Error</p>
                <p className="text-sm mt-1 drop-shadow-sm">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 max-w-3xl mx-auto w-full relative z-20 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Pregúntame sobre tus tareas..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-white/30 focus:outline-none focus:border-blue-500 focus:shadow-blue-500/50 focus:shadow-xl transition-all text-gray-800 placeholder-gray-500 text-sm"
              disabled={isLoading}
              maxLength={4000}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all hover:scale-105 shadow-2xl"
                title="Detener"
              >
                ⏹️
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-2xl"
              >
                📤
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
