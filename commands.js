import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.resolve(process.env.DATA_DIR || './data');
const dataFile = path.join(dataDir, 'users.json');
const tempFile = path.join(dataDir, 'users.tmp.json');

const defaultProfile = () => ({
  xp: 0,
  coins: 0,
  games: 0,
  wins: 0,
  quizCorrect: 0,
  updatedAt: new Date().toISOString(),
});

let database = { guilds: {} };
let writeQueue = Promise.resolve();

export async function initStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    const raw = await readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.guilds) {
      database = parsed;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('[STORE] Không đọc được users.json:', error);
    }
    await persist();
  }
}

function ensureGuild(guildId) {
  const key = guildId || 'direct-messages';
  database.guilds[key] ??= { users: {} };
  return database.guilds[key];
}

function ensureUser(guildId, userId) {
  const guild = ensureGuild(guildId);
  guild.users[userId] ??= defaultProfile();
  return guild.users[userId];
}

export function getProfile(guildId, userId) {
  return { ...ensureUser(guildId, userId) };
}

export async function addReward(guildId, userId, reward = {}) {
  const profile = ensureUser(guildId, userId);
  const fields = ['xp', 'coins', 'games', 'wins', 'quizCorrect'];

  for (const field of fields) {
    const amount = Number(reward[field] || 0);
    if (Number.isFinite(amount)) profile[field] += amount;
  }

  profile.updatedAt = new Date().toISOString();
  await persist();
  return { ...profile };
}

export function getLeaderboard(guildId, limit = 10) {
  const guild = ensureGuild(guildId);
  return Object.entries(guild.users)
    .map(([userId, profile]) => ({ userId, ...profile }))
    .sort((a, b) => b.xp - a.xp || b.coins - a.coins)
    .slice(0, Math.max(1, Math.min(25, limit)));
}

export async function flushStore() {
  await writeQueue;
}

function persist() {
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      const serialized = JSON.stringify(database, null, 2);
      await writeFile(tempFile, serialized, 'utf8');
      await rename(tempFile, dataFile);
    });

  return writeQueue;
}
