const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

code = code.replace(
  'export function VoiceCall() {',
  'export function VoiceCall({ propOrder, propMode, onClose }: { propOrder?: any, propMode?: "counselor" | "user", onClose?: () => void } = {}) {'
);

code = code.replace(
  '  const isCounselorView = Boolean(selectedCounselorOrder);\n  const order = isCounselorView ? selectedCounselorOrder : bookingOrder;',
  '  const isCounselorView = propMode === "counselor" || (!propMode && Boolean(selectedCounselorOrder));\n  const order = propOrder || (isCounselorView ? selectedCounselorOrder : bookingOrder);'
);

// Fix leaveMeeting and endMeeting to use onClose if provided
code = code.replace(
  '  const leaveMeeting = () => {\n    setActiveCallSession(null);\n    setIsCallMinimized(false);\n    popView();\n  };',
  '  const leaveMeeting = () => {\n    setActiveCallSession(null);\n    setIsCallMinimized(false);\n    if (onClose) onClose(); else popView();\n  };'
);

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);