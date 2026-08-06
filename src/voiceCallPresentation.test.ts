import assert from "node:assert/strict";
import test from "node:test";

import { getVoiceCallPresentation } from "./voiceCallPresentation";

test("video consultation keeps the participant-card layout after the other participant joins", () => {
  assert.deepEqual(getVoiceCallPresentation("waiting", true), {
    layout: "participant-cards",
    otherParticipantJoined: false,
  });
  assert.deepEqual(getVoiceCallPresentation("in-call", true), {
    layout: "participant-cards",
    otherParticipantJoined: true,
  });
});

test("audio consultation still uses its active-call visualization after joining", () => {
  assert.deepEqual(getVoiceCallPresentation("in-call", false), {
    layout: "audio-call",
    otherParticipantJoined: true,
  });
});
