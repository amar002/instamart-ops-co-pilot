import React, { useState } from 'react';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: number;
  message: string;
  type: 'user' | 'bot';
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, message: "Hello! I'm your Ops Co-Pilot. How can I help you today?", type: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      message: inputMessage,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        message: "I'm here to help with your operations questions. What specific metrics or issues would you like to discuss?",
        type: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent-500 text-white rounded-xl shadow-large hover:shadow-soft hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl z-50"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-dark-card border border-dark-border rounded-xl shadow-large flex flex-col z-50">
      {/* Header */}
      <div className="bg-accent-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <h3 className="font-bold">Ops Co-Pilot</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:text-white/80 transition-colors hover:bg-white/20 p-1 rounded-lg"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-xl text-sm shadow-soft ${
                message.type === 'user'
                  ? 'bg-accent-500 text-white'
                  : 'bg-dark-hover text-white'
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border border-dark-border bg-dark-hover rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent placeholder-gray-400 text-white"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-3 bg-accent-500 text-white rounded-xl hover:shadow-medium transition-all duration-200 font-medium hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 