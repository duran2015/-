const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

// 1. Remove the previously added chat button
const oldChatBtnRegex = /<button onClick=\{\(\) => setShowChat\(\!showChat\)\}[\s\S]*?<\/button>/;
code = code.replace(oldChatBtnRegex, '');

// 2. Add Chat Button right next to AI Panel Toggle (Top level in control bar)
const aiPanelToggleRegex = /\{\/\* AI Panel Toggle \(Highlight\) \*\/\}\s*\{meetingState === "in-call" && \(\s*<button onClick=\{\(\) => setAiPanelOpen\(\!aiPanelOpen\)\}[\s\S]*?<\/button>\s*\)\}/;

const newChatBtnAndAI = `{/* Chat Button (First Level) */}
            <button onClick={() => setShowChat(!showChat)} className={\`relative flex h-[52px] w-[52px] items-center justify-center rounded-[20px] transition-all active:scale-95 \${showChat ? "bg-[#EADDFF] text-[#21005D]" : "bg-white/10 text-white hover:bg-white/20"} shadow-sm\`}>
              <MessageSquare size={24} />
              {!showChat && messages.length > 0 && <span className="absolute top-0 right-0 flex h-3 w-3 rounded-full bg-[#D92D20] border-2 border-[#2C2A25]"></span>}
            </button>

            {/* AI Panel Toggle (Highlight) */}
            {meetingState === "in-call" && (
              <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className={\`flex h-[56px] w-[56px] flex-col items-center justify-center rounded-[22px] transition-all active:scale-95 \${aiPanelOpen ? "bg-[#EADDFF] text-[#21005D]" : "bg-[#6750A4] text-white shadow-[0_0_20px_rgba(103,80,164,0.6)]"}\`}>
                <Sparkles size={26} strokeWidth={2.5} />
              </button>
            )}`;

code = code.replace(aiPanelToggleRegex, newChatBtnAndAI);

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);