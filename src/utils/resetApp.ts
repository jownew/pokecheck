export const resetAppFreshReload = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // Defer import to avoid circular deps at module init
    const { clearCache } = await import('./pokemonData');

    // 1) Clear app-specific localStorage cache
    try {
      clearCache();
    } catch (e) {
      console.warn('clearCache failed:', e);
    }

    // 2) Clear Cache Storage (if any)
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.warn('Clearing CacheStorage failed:', e);
    }

    // 3) Unregister Service Workers (if any)
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch (e) {
      console.warn('Unregistering service workers failed:', e);
    }

    // 4) Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Clearing sessionStorage failed:', e);
    }

    // 5) Set a one-shot flag to force fresh network on next load
    try {
      sessionStorage.setItem('pokecheck_fresh', '1');
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('resetAppFreshReload encountered an issue:', err);
    try {
      sessionStorage.setItem('pokecheck_fresh', '1');
    } catch {}
  } finally {
    // Trigger a reload after cleanup
    window.location.reload();
  }
};

export const confirmResetAndReload = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  const ok = window.confirm(
    'This will clear cached data (storage, caches, service workers) and reload the app. Continue?'
  );
  if (!ok) return;
  await resetAppFreshReload();
};
