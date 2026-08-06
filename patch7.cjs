const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

// 1. Remove the More (...) button from the control bar
const moreBtnRegex = /<button onClick=\{\(\) => setShowMoreMenu\(true\)\}[\s\S]*?<\/button>/;
code = code.replace(moreBtnRegex, '');

// 2. Remove the showMoreMenu state
code = code.replace(/const \[showMoreMenu, setShowMoreMenu\] = useState\(false\);/, '');

// 3. Remove the entire More Menu Action Sheet section
const actionSheetRegex = /\{\/\* More Menu Action Sheet \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/;
code = code.replace(actionSheetRegex, '');

// 4. Move Risk Report and Flip Camera to the main control bar
// We need to insert them right before the End Call (PhoneOff) button
const endCallBtnRegex = /<button onClick=\{meetingState === "waiting" \? leaveMeeting : endMeeting\}[\s\S]*?<\/button>/;

const extraButtons = `
            {isVideo && (
              <button className="flex h-[52px] w-[52px] flex-col items-center justify-center rounded-[20px] bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 shadow-sm">
                <SwitchCamera size={24} />
              </button>
            )}
            {isCounselorView && (
              <button onClick={() => setShowRiskReport(true)} className="flex h-[52px] w-[52px] flex-col items-center justify-center rounded-[20px] bg-[#D92D20]/20 text-[#D92D20] border border-[#D92D20]/30 transition-all hover:bg-[#D92D20]/30 active:scale-95 shadow-sm">
                <AlertTriangle size={24} />
              </button>
            )}
`;

code = code.replace(endCallBtnRegex, match => extraButtons + match);

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);