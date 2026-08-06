const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

// 1. Fix isVideo check
code = code.replace(
  'const isVideo = order?.type === "video";',
  'const isVideo = order?.serviceTypeName?.includes("视频") || order?.type?.includes("video") || order?.type === "video";'
);

// 2. Add Chat button to control bar
const controlBarChatBtn = `          <button onClick={() => setShowChat(!showChat)} className={\`relative flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all \${showChat ? "bg-[#EADDFF] text-[#21005D]" : "bg-white/10 text-white hover:bg-white/20"} shadow-sm\`}>
            <MessageSquare size={24} />
            {!showChat && messages.length > 0 && <span className="absolute top-0 right-0 flex h-3 w-3 rounded-full bg-[#D92D20] border-2 border-[#2C2A25]"></span>}
          </button>`;

code = code.replace(
  /<button onClick=\{\(\) => setShowAIPanel\(\!showAIPanel\)\}[\s\S]*?<\/button>/,
  match => match + '\n\n' + controlBarChatBtn
);

// 3. Remove chat from More Menu
code = code.replace(
  /<button onClick=\{\(\) => \{ setShowMoreMenu\(false\); setShowChat\(true\); \}\}[\s\S]*?<\/button>/,
  ''
);

// 4. Replace Legacy Chat with Overlay Chat
const legacyChatRegex = /\{\/\* Legacy Chat \(fallback\) \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/;
const overlayChat = `{/* Overlay Chat directly on screen */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="absolute bottom-28 left-4 z-[90] flex flex-col justify-end pointer-events-none w-[75%]"
            style={{ maxHeight: '40vh' }}
          >
            <div className="overflow-y-auto space-y-3 pb-2 pointer-events-auto pr-2" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%)' }}>
              {messages.length === 0 && <div className="text-white/40 text-[12px] font-medium py-2">暂无聊天消息...</div>}
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl rounded-bl-sm px-3.5 py-2 text-[13px] leading-relaxed text-white/90 border border-white/10 shadow-sm inline-block">
                    <span className="font-bold text-[#EADDFF] mr-2">{msg.sender === "me" ? "我" : otherName}:</span>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pointer-events-auto flex items-center bg-black/50 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-lg">
              <input 
                aria-label="会议消息" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
                placeholder="发送消息..." 
                className="flex-1 bg-transparent px-3 text-[13px] text-white outline-none placeholder:text-white/50 font-medium" 
              />
              <button 
                onClick={sendMessage} 
                disabled={!inputValue.trim()} 
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6750A4] disabled:opacity-50 transition-opacity"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(legacyChatRegex, overlayChat);

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);