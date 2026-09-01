const FAVORITES_KEY = "wey-favorites";
const RECENTLY_VIEWED_KEY = "wey-recently-viewed";
const MAX_RECENT = 8;

/**
 * Lấy danh sách ID lá trà yêu thích
 */
export function getFavorites() {
    try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Toggle trạng thái yêu thích của 1 lá trà
 */
export function toggleFavoriteId(characterId) {
    if (!characterId) return [];
    try {
        const current = getFavorites();
        let updated;
        if (current.includes(characterId)) {
            updated = current.filter(id => id !== characterId);
        } else {
            updated = [characterId, ...current];
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: updated }));
        return updated;
    } catch (e) {
        console.error("Failed to toggle favorite:", e);
        return [];
    }
}

/**
 * Lấy danh sách ID lá trà đã xem gần đây (mới nhất lên đầu)
 */
export function getRecentlyViewed() {
    try {
        const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Ghi nhận lá trà vừa ghé thăm
 */
export function addRecentlyViewed(characterId) {
    if (!characterId) return [];
    try {
        const current = getRecentlyViewed().filter(id => id !== characterId);
        const updated = [characterId, ...current].slice(0, MAX_RECENT);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("recentlyViewedChanged", { detail: updated }));
        return updated;
    } catch (e) {
        console.error("Failed to add recently viewed:", e);
        return [];
    }
}

/**
 * Xóa danh sách đã ghé gần đây
 */
export function clearRecentlyViewed() {
    try {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
        window.dispatchEvent(new CustomEvent("recentlyViewedChanged", { detail: [] }));
    } catch (e) {
        console.error("Failed to clear recently viewed:", e);
    }
}
