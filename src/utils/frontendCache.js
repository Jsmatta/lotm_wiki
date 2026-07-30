// Frontend caching layer for LOTM Wiki
// Manages page navigation, search results, and detail page caching
// Strategy: Progressive caching with auto-expiry and LRU fallback

const PAGE_CACHE = new Map();
const DETAIL_CACHE = new Map();
const SEARCH_CACHE = new Map();

// Cache metadata: { createdAt, accessedAt, category }
const PAGE_CACHE_META = new Map();
const DETAIL_CACHE_META = new Map();
const SEARCH_CACHE_META = new Map();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 20;

/**
 * Get the earliest entry for a key to remove when at capacity
 */
function getEarliestEntry(key) {
  const entries = Array.from(PAGE_CACHE[key] || []);
  if (entries.length === 0) return null;
  const earliest = entries.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
  return earliest;
}

/**
 * Add entry to cache if not expired or at capacity
 */
function addEntry(cache, cacheMeta, key, value, force = false) {
  if (force) {
    cache.set(key, value);
    cacheMeta.set(key, { timestamp: Date.now(), accessedAt: Date.now() });
    return;
  }

  // Check expiry
  const meta = cacheMeta.get(key);
  if (meta && Date.now() - meta.timestamp < CACHE_DURATION) {
    cache.set(key, value);
    return;
  }

  // Remove expired entries and check capacity
  if (cache.size >= MAX_CACHE_SIZE) {
    // Evict based on age
    const keyToEvict = getEarliestEntry(key);
    if (keyToEvict && keyToEvict.value === value) {
      cache.delete(key);
      cacheMeta.delete(key);
    } else if (cache.has(keyToEvict?.key)) {
      cache.delete(keyToEvict.key);
      cacheMeta.delete(keyToEvict.key);
    }
  }

  cache.set(key, value);
  cacheMeta.set(key, { timestamp: Date.now(), accessedAt: Date.now() });
}

/**
 * Load entry from cache if valid
 */
function loadFromCache(cache, cacheMeta, key, loader, force = false) {
  if (force) return { isValid: true, value: loader(), meta: { timestamp: Date.now() } };

  const cached = cache.get(key);
  const meta = cacheMeta.get(key);

  if (cached) {
    const isExpired = !meta || Date.now() - meta.timestamp > CACHE_DURATION;
    if (!isExpired) {
      return { isValid: true, value: cached, meta };
    }
    // Cache expired, remove it
    cache.delete(key);
    cacheMeta.delete(key);
  }

  return { isValid: false };
}

/**
 * Page cache handler for category pages
 */
function handlePageCache(cache, cacheMeta, key, loader) {
  const cached = cache.get(key);
  const meta = cacheMeta.get(key);

  if (cached && meta) {
    const isExpired = Date.now() - meta.accessedAt > CACHE_DURATION;
    if (!isExpired) {
      return { isValid: true, value: cached, isCached: true, isExpired: isExpired };
    }
    // Still in cache but expired, keep for now (will be revalidated on next access)
    return { isValid: true, value: cached, isCached: true, isExpired: isExpired };
  }

  if (!cached || isExpired) {
    const data = loader();
    const newMeta = { timestamp: Date.now(), accessedAt: Date.now() };
    addEntry(cache, cacheMeta, key, data, false);
    return { isValid: data ? true : false, value: data || null, isCached: false, isExpired: true };
  }

  return { isValid: false };
}

/**
 * Detail cache handler for category:id pages
 */
function handleDetailCache(cache, cacheMeta, key, loader) {
  const cached = cache.get(key);
  const meta = cacheMeta.get(key);

  if (cached && meta) {
    const isExpired = Date.now() - meta.timestamp > CACHE_DURATION;
    if (!isExpired) {
      return { isValid: true, value: cached, isCached: true };
    }
    // Revalidate - check if still valid content
    const current = loader();
    if (current) {
      cache.set(key, current);
      cacheMeta.set(key, { timestamp: Date.now(), accessedAt: Date.now() });
      return { isValid: true, value: current, isCached: true };
    }
  }

  if (!cached) {
    const data = loader();
    if (data) {
      addEntry(cache, cacheMeta, key, data, true);
      return { isValid: true, value: data, isCached: false };
    }
  }

  return { isValid: false, value: null, isCached: false };
}

/**
 * Search cache handler
 */
function handleSearchCache(cache, cacheMeta, key, loader) {
  const cached = cache.get(key);
  const meta = cacheMeta.get(key);

  if (cached && meta) {
    const isExpired = Date.now() - meta.timestamp > CACHE_DURATION;
    if (!isExpired) {
      return { isValid: true, value: cached, isCached: true };
    }
    const current = loader();
    if (current) {
      cache.set(key, current);
      cacheMeta.set(key, { timestamp: Date.now(), accessedAt: Date.now() });
      return { isValid: true, value: current, isCached: true };
    }
  }

  if (!cached) {
    const data = loader();
    addEntry(cache, cacheMeta, key, data, false);
    return { isValid: data ? true : false, value: data || [], isCached: false };
  }

  return { isValid: false, value: null, isCached: false };
}

/**
 * Preload category cache for initial page load
 */
export async function preloadPageCache(category) {
  if (!category) return;

  const loader = () => {
    const files = {};
    Object.entries(categoryModules[category]).forEach(([path, module]) => {
      module().then(mdModule => {
        const fileName = path.split("/").pop().replace(/\.[^/.]+$/, "");
        files[fileName] = { content: mdModule.default };
      });
    });
    return new Promise(resolve => setTimeout(() => resolve(files), 100));
  };

  loadFromCache(PAGE_CACHE, PAGE_CACHE_META, category, loader, true);
}

/**
 * Load page from cache
 */
export function loadPageFromCache(key) {
  const { isValid, value } = handlePageCache(PAGE_CACHE, PAGE_CACHE_META, key, () => null);
  return { isValid, value };
}

/**
 * Load detail page from cache
 */
export function loadDetailFromCache(category, id) {
  const key = `${category}:${id}`;
  const { isValid, value, isCached } = handleDetailCache(DETAIL_CACHE, DETAIL_CACHE_META, key, () => null);
  return { isValid, value, isCached };
}

/**
 * Load search results from cache
 */
export function loadSearchFromCache(query) {
  const key = query;
  const { isValid, value } = handleSearchCache(SEARCH_CACHE, SEARCH_CACHE_META, query, () => null);
  return { isValid, value };
}

export { handlePageCache, handleDetailCache, handleSearchCache };
export { CACHE_DURATION, MAX_CACHE_SIZE };
