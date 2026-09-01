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
    onSnapshot,
    serverTimestamp,
    writeBatch
} from "firebase/firestore";
import { createActivity } from "./activityService";

const COLLECTION = "feedbacks";
const LOCAL_STORAGE_KEY = "wey-feedbacks";

/**
 * Thêm feedback mới (Lưu Firestore + tạo Activity + cập nhật LocalStorage)
 */
export async function addFeedback({
    characterId,
    characterName = "Unknown",
    userId,
    name,
    message
}) {
    const feedbackPayload = {
        characterId: characterId || "",
        characterName: characterName || "Vườn Trà",
        userId: userId || "",
        name: name.trim(),
        message: message.trim(),
        read: false,
        createdAt: Date.now(),
        serverTime: serverTimestamp()
    };

    let firestoreId = null;

    try {
        const docRef = await addDoc(collection(db, COLLECTION), feedbackPayload);
        firestoreId = docRef.id;

        // Tạo notification activity cho Admin
        createActivity({
            type: "feedback",
            action: "created",
            characterId,
            characterName,
            title: `🍃 Có lời nhắn mới từ trà hữu ${name}`,
            message: message.length > 80 ? `${message.substring(0, 80)}...` : message,
            read: false
        });
    } catch (error) {
        console.warn("Could not save feedback to Firestore (fallback to local only):", error);
    }

    const localItem = {
        id: firestoreId || crypto.randomUUID(),
        ...feedbackPayload
    };

    // Update local storage backup
    try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify([localItem, ...existing])
        );
    } catch (err) {
        console.error("Local storage update error:", err);
    }

    return localItem;
}

/**
 * Lấy tất cả feedback
 */
export async function getFeedbacks() {
    try {
        const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));
    } catch (error) {
        console.warn("Could not fetch feedbacks from Firestore, using local:", error);
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    }
}

/**
 * Realtime listener feedback
 */
export function subscribeFeedbacks(callback) {
    try {
        const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
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
                console.warn("Feedbacks snapshot error:", error);
                const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
                callback(local);
            }
        );
    } catch (error) {
        console.warn("subscribeFeedbacks failed:", error);
        return () => {};
    }
}

/**
 * Cập nhật trạng thái đã đọc/chưa đọc
 */
export async function markFeedbackRead(id, read = true) {
    try {
        const ref = doc(db, COLLECTION, id);
        await updateDoc(ref, { read });
    } catch (error) {
        console.warn("Error marking feedback read:", error);
    }
}

/**
 * Xoá feedback
 */
export async function deleteFeedback(id) {
    try {
        await deleteDoc(doc(db, COLLECTION, id));
    } catch (error) {
        console.warn("Error deleting feedback from Firestore:", error);
    }

    // Xoá cả ở local storage nếu có
    try {
        const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        const filtered = list.filter(item => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
        console.error("Local storage delete error:", err);
    }
}

/**
 * Di chuyển feedback từ localStorage lên Firestore (cho admin 1-click sync)
 */
export async function migrateLocalFeedbacks(characters = []) {
    try {
        const localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        if (localList.length === 0) return 0;

        const currentFirestore = await getFeedbacks();
        const existingMessages = new Set(currentFirestore.map(f => `${f.userId || ''}_${f.message}_${f.characterId}`));

        let migratedCount = 0;
        const charMap = new Map(characters.map(c => [c.id, c.name]));

        const batch = writeBatch(db);

        for (const item of localList) {
            const key = `${item.userId || ''}_${item.message}_${item.characterId}`;
            if (!existingMessages.has(key)) {
                const newDocRef = doc(collection(db, COLLECTION));
                batch.set(newDocRef, {
                    characterId: item.characterId || "",
                    characterName: item.characterName || charMap.get(item.characterId) || "Vườn Trà",
                    userId: item.userId || "",
                    name: item.name || "Trà hữu ẩn danh",
                    message: item.message || "",
                    read: Boolean(item.read),
                    createdAt: item.createdAt || Date.now(),
                    serverTime: serverTimestamp()
                });
                migratedCount++;
            }
        }

        if (migratedCount > 0) {
            await batch.commit();
        }

        return migratedCount;
    } catch (error) {
        console.error("Migration error:", error);
        throw error;
    }
}
