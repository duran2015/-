const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

// 1. Remove SwitchCamera from the bottom control bar
const bottomSwitchRegex = /\{\s*isVideo && \(\s*<button className="flex h-\[46px\] w-\[46px\] sm:h-\[52px\] sm:w-\[52px\] flex-col items-center justify-center rounded-\[20px\] bg-white\/10 text-white transition-all hover:bg-white\/20 active:scale-95 shadow-sm">\s*<SwitchCamera size=\{24\} \/>\s*<\/button>\s*\)\s*\}/;
code = code.replace(bottomSwitchRegex, '');

// 2. Put SwitchCamera back to the top right corner
const topRightContainer = /<div className="mt-2 text-\[13px\] font-mono text-white\/80 drop-shadow-md font-bold tracking-widest">\{meetingState === "waiting" \? "1\/2 人已入会" : formatTime\(duration\)\}<\/div>\s*<\/div>/;

const topSwitchCameraHTML = `
          <div className="mt-2 text-[13px] font-mono text-white/80 drop-shadow-md font-bold tracking-widest">{meetingState === "waiting" ? "1/2 人已入会" : formatTime(duration)}</let code = fs.readFileSy  
// 1. Remove SwitchCamera from the bottom control bar
const bottomSwitchRegex = /\{像const bottomSwitchRegex = /\{\s*isVideo && \(\s*<buty-code = code.replace(bottomSwitchRegex, '');

// 2. Put SwitchCamera back to the top right corner
const topRightContainer = /<div className="mt-2 text-\[13px\] font-mono text-white\/80 drop-shadow-md font-bold tracking-widest">\{meetingState === "waiting" \? "1\/2 人已入会" : formatTime\(duration\)\}<\/dcode);
