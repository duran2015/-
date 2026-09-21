import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CONSULTANT } from './data/mockData';
import { createSnapshot, decodeSnapshot, displayIds, encodeSnapshot, moveDisplayContent, profileCopyKey, publicProfile, readSavedCopy, saveProfileCopy, selectedContent, snapshotLink } from './components/Growth/profileSharing';

test('public profile is an explicit allowlist, not the consultant private record', () => {
  const profile = publicProfile(INITIAL_CONSULTANT);
  assert.deepEqual(Object.keys(profile).sort(), ['id', 'name', 'avatar', 'title', 'bio', 'targetAudience', 'specialties', 'counselingStyle'].sort());
  assert.equal('licenseNo' in profile, false);
  assert.equal('earnings' in profile, false);
  assert.equal('referralStats' in profile, false);
});
test('selection preserves order, removes duplicate/unknown/unpublished content and permits empty', () => {
  assert.deepEqual(displayIds(['energy-check-in', 'work-expectations', 'energy-check-in', 'rest-draft', 'unknown']), ['energy-check-in', 'work-expectations']);
  assert.deepEqual(displayIds([]), []);
  assert.deepEqual(selectedContent([]), []);
});
test('reordering is immutable and bounded', () => {
  const ids = ['work-expectations', 'energy-check-in'];
  assert.deepEqual(moveDisplayContent(ids, 'energy-check-in', -1), ['energy-check-in', 'work-expectations']);
  assert.deepEqual(ids, ['work-expectations', 'energy-check-in']);
  assert.deepEqual(moveDisplayContent(ids, 'work-expectations', -1), ids);
  assert.deepEqual(moveDisplayContent(ids, 'unknown', 1), ids);
});
test('share snapshot round-trips Chinese text and is usable without sender storage', () => {
  const snapshot = createSnapshot({ ...INITIAL_CONSULTANT, bio: '沟通与成长 🌱\n按照自己的节奏。' }, ['energy-check-in']);
  const url = new URL(snapshotLink('http://localhost:4311', snapshot));
  assert.equal(url.pathname, '/counselor/shared');
  assert.deepEqual(decodeSnapshot(url.hash.slice(1)), snapshot);
  assert.equal(url.search, '');
});
test('invalid or oversized snapshot is rejected', () => {
  for (const input of ['', 'not-json', 'a'.repeat(16001), btoa('{}')]) assert.equal(decodeSnapshot(input), null);
});
test('receiver drops injected fields, unsafe image URL and unpublished content', () => {
  const snapshot = createSnapshot(INITIAL_CONSULTANT, []);
  const dirty = { ...snapshot, contentIds: ['rest-draft', 'work-expectations'], profile: { ...snapshot.profile, avatar: 'javascript:alert(1)', earnings: { withdrawable: 999 }, licenseNo: 'not-public' } };
  const result = decodeSnapshot(encodeSnapshot(dirty));
  assert.equal(result?.profile.avatar, '');
  assert.equal('licenseNo' in result!.profile, false);
  assert.equal('earnings' in result!.profile, false);
  assert.deepEqual(result?.contentIds, ['work-expectations']);
});
test('stored public copy is shared with the profile and leaves private fields intact', () => {
  const map = new Map<string, string>();
  const storage = { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value); } };
  const updated = { ...INITIAL_CONSULTANT, bio: '新版公开简介', targetAudience: ['职场人'] };
  saveProfileCopy(storage, updated);
  const stored = JSON.parse(map.get(profileCopyKey(updated.id))!);
  assert.equal('licenseNo' in stored, false);
  assert.equal('name' in stored, false);
  const loaded = readSavedCopy(storage, INITIAL_CONSULTANT);
  assert.equal(loaded.bio, '新版公开简介');
  assert.deepEqual(loaded.targetGroups, ['职场人']);
  assert.equal(loaded.licenseNo, INITIAL_CONSULTANT.licenseNo);
  assert.equal(loaded.earnings, INITIAL_CONSULTANT.earnings);
});
test('corrupt/unavailable storage falls back safely, failed writes are not claimed as saved', () => {
  assert.equal(readSavedCopy({ getItem: () => 'bad json' }, INITIAL_CONSULTANT), INITIAL_CONSULTANT);
  assert.equal(readSavedCopy({ getItem: () => { throw new Error('blocked'); } }, INITIAL_CONSULTANT), INITIAL_CONSULTANT);
  assert.throws(() => saveProfileCopy({ setItem: () => { throw new Error('quota'); } }, INITIAL_CONSULTANT));
});
