import type { ConsultantProfile } from '../../types';

export type PublicProfile = Pick<ConsultantProfile, 'id' | 'name' | 'avatar' | 'title' | 'bio'> & {
  targetAudience: string[];
  specialties: string[];
  counselingStyle: string;
};
export type ProfileCopy = Pick<PublicProfile, 'bio' | 'targetAudience' | 'specialties' | 'counselingStyle'>;
export type DisplayContent = { id: string; title: string; kind: 'article' | 'questionnaire'; status: 'published' | 'draft'; description: string; paragraphs: string[]; questions?: string[] };
export const PROFILE_CONTENT: DisplayContent[] = [
  { id: 'work-expectations', title: '为什么越优秀的人越容易焦虑？', kind: 'article', status: 'published', description: '看看期待、边界与工作压力之间的关系。', paragraphs: [
    '有时让人疲惫的，不只是任务量，还有“每一件事都不能出错”的期待。这并不是对所有人的判断，你可以先看看它是否符合自己的经验。',
    '试着区分：哪些是任务明确要求的，哪些是自己额外加上的标准？把它们写成两列，可能更容易看清哪些地方可以商量。',
    '当几件工作同时到来，可以向同事或主管确认优先级，而不是独自承担所有冲突。你也可以给自己留出不处理工作的休息时间。',
    '这篇内容用于日常自我探索，不作诊断，也不替代个人化的专业支持。'
  ] },
  { id: 'energy-check-in', title: '自测：你是否正处于情绪耗竭状态？', kind: 'questionnaire', status: 'published', description: '3 个问题，回看最近的精力与休息。', paragraphs: ['这是一份演示用自我探索问卷，不是经过验证的心理量表，不计算风险等级，也不用于诊断。你的选择不会发送给咨询师。'], questions: ['最近一周，工作结束后你通常还有精力吗？', '最近一周，你有没有能暂时放下工作的休息时间？', '面对接下来的工作，你通常是什么感受？'] },
  { id: 'conversation-boundaries', title: '临时任务来了，如何说清楚自己的边界', kind: 'article', status: 'published', description: '准备一次关于时间和优先级的沟通。', paragraphs: ['先描述事实，再说清限制，最后提出可商量的选项。例如：“我今天已有两项到期任务。如果增加这一项，我们可以一起确认哪项后移吗？”', '这不是一种保证成功的话术。你可以结合关系、工作环境和自己的安全感决定是否使用。'] },
  { id: 'rest-draft', title: '给下班后的自己留一点空间', kind: 'article', status: 'draft', description: '尚未发布，不能对外展示。', paragraphs: ['未发布的内容草稿。'] }
];
export const DEFAULT_CONTENT_IDS = ['work-expectations', 'energy-check-in'];
export const PROFILE_SHARE_PATH = '/counselor/shared';
export const profileCopyKey = (id: string) => `kelu:profile-copy:v1:${id}`;
export const profileDisplayKey = (id: string) => `kelu:profile-display:v1:${id}`;
export const profileDraftKey = (id: string) => `kelu:profile-draft:v1:${id}`;
const text = (value: unknown, limit = 1200) => typeof value === 'string' ? value.slice(0, limit).trim() : '';
const tags = (value: unknown) => Array.isArray(value) ? value.slice(0, 12).map(v => text(v, 80)).filter(Boolean) : [];
export function profileCopy(profile: Partial<PublicProfile>): ProfileCopy {
  return { bio: text(profile.bio), targetAudience: tags(profile.targetAudience), specialties: tags(profile.specialties), counselingStyle: text(profile.counselingStyle, 400) };
}
export function publicProfile(profile: ConsultantProfile): PublicProfile {
  return { id: profile.id, name: profile.name, avatar: safeAvatar(profile.avatar), title: profile.title, ...profileCopy({ ...profile, targetAudience: profile.targetAudience ?? profile.targetGroups }) };
}
function safeAvatar(value: unknown) {
  const url = text(value, 1500);
  return /^https:\/\//.test(url) || /^\/(?!\/)/.test(url) ? url : '';
}
export function displayIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [...DEFAULT_CONTENT_IDS];
  return [...new Set(ids)].filter((id): id is string => typeof id === 'string' && PROFILE_CONTENT.some(c => c.id === id && c.status === 'published'));
}
export function moveDisplayContent(ids: string[], id: string, direction: -1 | 1): string[] {
  const result = [...ids]; const index = result.indexOf(id); const next = index + direction;
  if (index >= 0 && next >= 0 && next < result.length) [result[index], result[next]] = [result[next], result[index]];
  return result;
}
export function selectedContent(ids: string[]) {
  return displayIds(ids).map(id => PROFILE_CONTENT.find(c => c.id === id)!);
}
export function readSavedCopy(storage: Pick<Storage, 'getItem'>, profile: ConsultantProfile): ConsultantProfile {
  try {
    const raw = storage.getItem(profileCopyKey(profile.id));
    if (!raw) return profile;
    const copy = profileCopy(JSON.parse(raw));
    return { ...profile, ...copy, targetGroups: copy.targetAudience };
  } catch { return profile; }
}
export function saveProfileCopy(storage: Pick<Storage, 'setItem'>, profile: ConsultantProfile) {
  storage.setItem(profileCopyKey(profile.id), JSON.stringify(profileCopy({ ...profile, targetAudience: profile.targetAudience ?? profile.targetGroups })));
}
export type PublicSnapshot = { v: 1; profile: PublicProfile; contentIds: string[]; createdAt: string };
export function createSnapshot(profile: ConsultantProfile, contentIds: string[]): PublicSnapshot {
  return { v: 1, profile: publicProfile(profile), contentIds: displayIds(contentIds), createdAt: new Date().toISOString() };
}
export function encodeSnapshot(snapshot: PublicSnapshot): string {
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}
export function decodeSnapshot(value: string): PublicSnapshot | null {
  try {
    if (!value || value.length > 16000) return null;
    const bytes = Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
    const raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (raw.v !== 1 || !raw.profile || !text(raw.profile.name) || !text(raw.profile.id) || !Array.isArray(raw.contentIds) || !Number.isFinite(Date.parse(raw.createdAt))) return null;
    return { v: 1, profile: { id: text(raw.profile.id, 80), name: text(raw.profile.name, 80), title: text(raw.profile.title, 160), avatar: safeAvatar(raw.profile.avatar), ...profileCopy(raw.profile) }, contentIds: displayIds(raw.contentIds), createdAt: new Date(raw.createdAt).toISOString() };
  } catch { return null; }
}
export const snapshotLink = (origin: string, snapshot: PublicSnapshot) => `${origin}${PROFILE_SHARE_PATH}#${encodeSnapshot(snapshot)}`;
