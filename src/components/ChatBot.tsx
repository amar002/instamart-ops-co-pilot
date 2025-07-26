import React, { useState } from 'react';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: number;
  message: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      message: "Hello! I'm your Ops Co-Pilot. I can help you with:\n\n• 📊 Analyze pod performance\n• 🚨 Identify critical issues\n• 💡 Suggest actions\n• 📈 Explain metrics\n\nWhat would you like to know?", 
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Quick action suggestions
  const quickActions = [
    { text: "Show me critical pods", icon: "🚨" },
    { text: "What actions should I take?", icon: "💡" },
    { text: "Explain O2HAR metric", icon: "📊" },
    { text: "How to improve performance?", icon: "📈" }
  ];

  const generateContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('critical') || message.includes('breaching') || message.includes('urgent')) {
      return "🚨 **Critical Issues Detected:**\n\nBased on current data, I can see several pods are breaching thresholds. Here's what you should do:\n\n1. **Immediate Actions:**\n   • Call DEs for breaching pods\n   • Increase surge pricing for high O2HAR pods\n   • Contact pod owners for urgent issues\n\n2. **Priority Order:**\n   • Focus on pods with both O2HAR and Unserviceability breaches\n   • Then address single metric breaches\n   • Finally, monitor pods approaching thresholds\n\nWould you like me to show you specific pod details?";
    }
    
    if (message.includes('o2har') || message.includes('order to hand')) {
      return "📊 **O2HAR (Order to Handover Average Response) Explained:**\n\n**What it is:** Time from order placement to delivery partner handover\n\n**Current Threshold:** 9.0 minutes\n\n**Why it matters:**\n• Affects customer satisfaction\n• Impacts delivery efficiency\n• Influences partner earnings\n\n**Common causes of high O2HAR:**\n• Low DE availability\n• High order volume\n• Restaurant delays\n• System issues\n\n**Quick fixes:**\n• Increase surge pricing\n• Call more DEs\n• Optimize restaurant coordination";
    }
    
    if (message.includes('unserviceability') || message.includes('service')) {
      return "📊 **Unserviceability Explained:**\n\n**What it is:** Percentage of orders that cannot be fulfilled due to lack of delivery partners\n\n**Current Threshold:** 5.0%\n\n**Why it matters:**\n• Lost revenue opportunities\n• Poor customer experience\n• Partner dissatisfaction\n\n**Common causes:**\n• Insufficient DE coverage\n• High demand spikes\n• Partner churn\n• Zone imbalances\n\n**Quick fixes:**\n• Activate backup DEs\n• Increase incentives\n• Optimize zone coverage";
    }
    
    if (message.includes('action') || message.includes('what should') || message.includes('help')) {
      return "💡 **Recommended Actions Based on Current Data:**\n\n**For High O2HAR Pods:**\n• Increase surge pricing by 15-20%\n• Call Full-time DEs (FT1+ ULTRA, FT2)\n• Activate Reactivations cohort\n\n**For High Unserviceability Pods:**\n• Call Part-time DEs and Floaters\n• Increase base incentives\n• Optimize zone coverage\n\n**For Critical Pods (Both metrics breached):**\n• Immediate DE callout\n• Maximum surge pricing\n• Escalate to city owner\n• Monitor hourly progress\n\n**Proactive Measures:**\n• Set up alerts for threshold breaches\n• Regular DE engagement\n• Performance trend analysis";
    }
    
    if (message.includes('improve') || message.includes('better') || message.includes('optimize')) {
      return "📈 **Performance Improvement Strategies:**\n\n**Short-term (0-2 hours):**\n• Immediate DE callouts\n• Surge pricing adjustments\n• Emergency partner activation\n\n**Medium-term (2-24 hours):**\n• Partner engagement programs\n• Zone optimization\n• Restaurant coordination\n• Incentive structure review\n\n**Long-term (1-7 days):**\n• Partner retention programs\n• Technology improvements\n• Process optimization\n• Training and development\n\n**Key Metrics to Monitor:**\n• DE login rates\n• Order acceptance rates\n• Partner satisfaction scores\n• Customer feedback";
    }
    
    if (message.includes('surge') || message.includes('pricing')) {
      return "💰 **Surge Pricing Strategy:**\n\n**When to increase surge:**\n• O2HAR > 9.0 minutes\n• High order volume\n• Low DE availability\n• Peak hours\n\n**Recommended increases:**\n• **FT1+ ULTRA:** ₹22 → ₹26 (+18%)\n• **FT2:** ₹20 → ₹24 (+20%)\n• **NEW_SSU:** ₹18 → ₹22 (+22%)\n• **Others:** ₹18 → ₹20 (+11%)\n\n**Implementation:**\n• Start with 15% increase\n• Monitor for 30 minutes\n• Adjust based on response\n• Communicate to partners\n\n**Best practices:**\n• Gradual increases work better\n• Communicate changes clearly\n• Monitor partner feedback\n• Have rollback plan ready";
    }
    
    if (message.includes('de') || message.includes('delivery') || message.includes('partner')) {
      return "👥 **DE (Delivery Executive) Management:**\n\n**Cohort Types:**\n• **FT1+ ULTRA:** Most reliable, highest capacity\n• **FT2:** Full-time, consistent availability\n• **NEW_SSU:** New partners, need support\n• **OLD_SSU:** Experienced, stable\n• **REACTIVATIONS:** Returning partners\n• **FT/PT:** Flexible availability\n• **Floaters:** On-demand support\n\n**Callout Strategy:**\n• **Critical pods:** Call all cohorts\n• **High O2HAR:** Focus on FT cohorts\n• **High Unserviceability:** Activate PT and Floaters\n• **Normal operations:** Regular engagement\n\n**Incentive Structure:**\n• Base + Performance bonuses\n• Peak hour incentives\n• Loyalty programs\n• Recognition rewards";
    }
    
    return "I'm here to help with your operations questions! You can ask me about:\n\n• 📊 **Metrics:** O2HAR, Unserviceability explanations\n• 🚨 **Issues:** Critical pod identification and actions\n• 💡 **Actions:** Recommended steps for improvement\n• 📈 **Strategy:** Performance optimization tips\n• 💰 **Pricing:** Surge pricing strategies\n• 👥 **Partners:** DE management and callouts\n\nWhat specific aspect would you like to explore?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      message: inputMessage,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate contextual response
    setTimeout(() => {
      const botResponse = generateContextualResponse(inputMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        message: botResponse,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
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
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-dark-card border border-dark-border rounded-xl shadow-large flex flex-col z-50">
      {/* Header */}
      <div className="bg-accent-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h3 className="font-bold">Ops Co-Pilot</h3>
            <p className="text-xs opacity-80">AI Assistant</p>
          </div>
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
              className={`max-w-xs px-4 py-3 rounded-xl text-sm shadow-soft whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-accent-500 text-white'
                  : 'bg-dark-hover text-white'
              }`}
            >
              {message.message}
              <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className="text-xs bg-dark-hover text-white px-3 py-2 rounded-lg hover:bg-dark-border transition-colors flex items-center space-x-1"
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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