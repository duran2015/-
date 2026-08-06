export type MeetingState = "lobby" | "waiting" | "in-call" | "ended";

export type VoiceCallPresentation = {
  layout: "participant-cards" | "audio-call";
  otherParticipantJoined: boolean;
};

export function getVoiceCallPresentation(
  meetingState: MeetingState,
  isVideo: boolean,
): VoiceCallPresentation {
  const otherParticipantJoined = meetingState === "in-call";

  return {
    layout: otherParticipantJoined && !isVideo ? "audio-call" : "participant-cards",
    otherParticipantJoined,
  };
}
