const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

const oldContainer = '<div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-[28px] bg-black/40 px-5 py-3 backdrop-blur-2xl border border-white/10 shadow-2xl z-30">';
const newContainer = '<div className="absolute bottom-8 left-1/2 flex w-max max-w-[95vw] -translate-x-1/2 items-center justify-center gap-1.5 sm:gap-3 rounded-[28px] bg-black/40 px-3 sm:px-5 py-2.5 sm:py-3 backdrop-blur-2xl border border-white/10 shadow-2xl z-30">';
code = code.replace(oldContainer, newContainer);

code = code.replace(/h-\[46px\] w-\[46px\]/g, 'h-[42px] w-[42px] shrink-0');
code = code.replace(/h-\[50px\] w-\[50px\]/g, 'h-[46px] w-[46px] shrink-0');
code = code.replace(/size=\{24\}/g, 'size={22}');
code = code.replace(/size=\{26\}/g, 'size={24}');

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);
