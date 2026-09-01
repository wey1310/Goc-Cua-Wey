import db from "../firebase/firestore";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from "firebase/firestore";

const COLLECTION = "activities";

// Cache to prevent duplicate milestone notifications
const triggeredMilestones = new Set();

/**
 * Tạo một activity mới
 */
export async function createActivity({
    type = "system",
    action = "created",
    characterId = null,
    characterName = "",
    title = "",
    message = "",
    milestone = null,
    read = false
}) {
    try {
        if (!title && !message) return null;

        // Dedup milestones in memory session
        if (type === "milestone" && milestone) {
            const milestoneKey = `${characterId || 'global'}_${milestone}`;
            if (triggeredMilestones.has(milestoneKey)) {
                return null;
            }
            triggeredMilestones.add(milestoneKey);
        }

        const payload = {
            type,
            action,
            characterId: characterId || "",
            characterName: characterName || "",
            title: title || "",
            message: message || "",
            milestone: milestone || null,
            read: Boolean(read),
            createdAt: Date.now(),
            serverTime: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, COLLECTION), payload);
        return docRef.id;
    } catch (error) {
        console.warn("Could not create activity in Firestore:", error);
        return null;
    }
}

/**
 * Lấy danh sách activity
 */
export async function getActivities(limitCount = 50) {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));
    } catch (error) {
        console.warn("Could not get activities:", error);
        return [];
    }
}

/**
 * Realtime listener activities
 */
export function subscribeActivities(callback, limitCount = 50) {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        return onSnapshot(
            q,
            snapshot => {
                const list = snapshot.docs.map(item => ({
                    id: item.id,
                    ...item.data()
                }));
                callback(list);
            },
            error => {
                console.warn("Activities realtime error:", error);
                callback([]);
            }
        );
    } catch (error) {
        console.warn("subscribeActivities failed:", error);
        return () => {};
    }
}

/**
 * Đánh dấu 1 activity đã đọc/chưa đọc
 */
export async function markActivityRead(id, read = true) {
    try {
        const ref = doc(db, COLLECTION, id);
        await updateDoc(ref, { read });
    } catch (error) {
        console.warn("Error marking activity read:", error);
    }
}

/**
 * Đánh dấu tất cả activities là đã đọc
 */
export async function markAllActivitiesRead(activities = []) {
    try {
        const unread = activities.filter(a => !a.read);
        if (unread.length === 0) return;

        const batch = writeBatch(db);
        unread.forEach(item => {
            const ref = doc(db, COLLECTION, item.id);
            batch.update(ref, { read: true });
        });
        await batch.commit();
    } catch (error) {
        console.warn("Error marking all read:", error);
    }
}

/**
 * Xóa 1 activity
 */
export async function deleteActivity(id) {
    try {
        await deleteDoc(doc(db, COLLECTION, id));
    } catch (error) {
        console.warn("Error deleting activity:", error);
    }
}

/**
 * Xóa toàn bộ activity
 */
export async function clearAllActivities(activities = []) {
    try {
        if (!activities.length) return;
        const batch = writeBatch(db);
        activities.forEach(item => {
            const ref = doc(db, COLLECTION, item.id);
            batch.delete(ref);
        });
        await batch.commit();
    } catch (error) {
        console.warn("Error clearing activities:", error);
    }
}
