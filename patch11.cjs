const fs = require('fs');
let code = fs.readFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', 'utf-8');

code = code.replace(
  '  const endMeeting = () => {\n    if (order?.id) updateOrder(order.id, { status: "completed", callDuration: duration });\n    setMeetingState("ended");\n    setShowChat(false);\n    setAiPanelOpen(false);\n    setIsCallMinimized(false);\n  };',
  '  const endMeeting = () => {\n    if (order?.id) updateOrder(order.id, { status: "completed", callDuration: duration });\n    setMeetingState("ended");\n    setShowChat(false);\n    setAiPanelOpen(false);\n    setIsCallMinimized(false);\n  };\n\n  const finishAndGoToSummary = () => {\n    leaveMeeting();\n    if (isCounselorView) {\n      if (onClose) {\n         const event = new CustomEvent("open-ai-summary", { detail: order });\n         window.dispatchEvent(event);\n      } else {\n         pushView("counselor-session-notes" as any);\n      }\n    } else {\n      pushView("user-evaluation" as any);\n    }\n  };'
);

code = code.replace(
  /onClick=\{\(\) => \{\s*leaveMeeting\(\);\s*if \(isCounselorView\) \{\s*pushView\("counselor-session-notes" as any\);\s*\} else \{\s*pushView\("user-evaluation" as any\);\s*\}\s*\}\}/,
  'onClick={finishAndGoToSummary}'
);

fs.writeFileSync('src/client-app/pages/Counseling/VoiceCall.tsx', code);

// Now patch App.tsx to listen for the event
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appCode.includes('open-ai-summary')) {
  appCode = appCode.replace(
    '  // Action Handlers',
    '  // Action Handlers\n  React.useEffect(() => {\n    const handler = (e: any) => {\n      setSelectedOrderForSummary(e.detail);\n    };\n    window.addEventListener("open-ai-summary", handler);\n    return () => window.removeEventListener("open-ai-summary", handler);\n  }, []);\n'
  );
  fs.writeFileSync('src/App.tsx', appCode);
}