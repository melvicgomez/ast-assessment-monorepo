require('dotenv').config();

let usersCache = [];
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000;

async function getUsers() {
  const now = Date.now();
  if (!usersCache.length || now - lastFetchTime > CACHE_TTL) {
    const response = await fetch(process.env.API_URL_DUMMY_JSON);
    const data = await response.json();
    usersCache = data.users || [];
    lastFetchTime = now;
  }
  return usersCache;
}

module.exports = { getUsers };
