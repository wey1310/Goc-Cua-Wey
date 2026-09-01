import db from "../firebase/firestore";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    setDoc,
    deleteDoc,
    doc,
    increment,
    getDoc,
    onSnapshot
} from "firebase/firestore";
import { createActivity } from "./activityService";

const COLLECTION = "characters";
const STATS = "stats";

// Milestone thresholds
const VIEW_MILESTONES = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
const VISIT_MILESTONES = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

// =======================
// Lấy toàn bộ nhân vật
// =======================
export async function getCharacters() {
    const snapshot = await getDocs(
        collection(db, COLLECTION)
    );

    return snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
    }));
}

// =======================
// Realtime Characters
// =======================
export function subscribeCharacters(callback) {
    return onSnapshot(
        collection(db, COLLECTION),
        snapshot => {
            callback(
                snapshot.docs.map(item => ({
                    id: item.id,
                    ...item.data()
                }))
            );
        }
    );
}

// =======================
// Thêm nhân vật
// =======================
export async function addCharacter(character) {
    const {
        id,
        ...payload
    } = character;

    const docRef = await addDoc(
        collection(db, COLLECTION),
        {
            ...payload,
            views: Number(payload.views || 0),
            ggaiClick: Number(payload.ggaiClick || 0),
            plotClick: Number(payload.plotClick || 0),
            leafCount: Number(payload.leafCount || 1),
            createdAt: Date.now()
        }
    );

    createActivity({
        type: "system",
        action: "created",
        characterId: docRef.id,
        characterName: payload.name || "",
        title: `🍃 Đã gieo mầm Lá Trà mới: ${payload.name || "Chưa có tên"}`,
        message: payload.quote || "Lá Trà mới đã xuất hiện trong vườn.",
        read: false
    });

    return docRef.id;
}

// =======================
// Cập nhật
// =======================
export async function updateCharacter(character) {
    const {
        id,
        ...payload
    } = character;

    const ref = doc(
        db,
        COLLECTION,
        id
    );

    await updateDoc(
        ref,
        payload
    );
}

// =======================
// Tăng lượt click GGAI
// =======================
export async function increaseGGAIClick(id, characterName = "") {
    if (!id) return;
    const ref = doc(
        db,
        COLLECTION,
        id
    );

    await updateDoc(
        ref,
        {
            ggaiClick: increment(1)
        }
    );

    createActivity({
        type: "ggai",
        action: "click",
        characterId: id,
        characterName: characterName || "Lá Trà",
        title: `🍵 ${characterName ? characterName : 'Một Lá Trà'} vừa nhận thêm 1 lượt thưởng thức GGAI`,
        message: `Trà hữu đã nhấp vào tách trà GGAI.`,
        read: false
    });
}

// =======================
// Tăng lượt click Plot
// =======================
export async function increasePlotClick(id, characterName = "") {
    if (!id) return;
    const ref = doc(
        db,
        COLLECTION,
        id
    );

    await updateDoc(
        ref,
        {
            plotClick: increment(1)
        }
    );

    createActivity({
        type: "plot",
        action: "click",
        characterId: id,
        characterName: characterName || "Lá Trà",
        title: `📖 Một trà hữu vừa mở Plot của ${characterName || 'Lá Trà'}`,
        message: `Trà hữu đang khám phá cốt truyện thế giới của ${characterName || 'nhân vật'}.`,
        read: false
    });
}

// =======================
// Tăng lượt xem
// =======================
export async function increaseView(id, characterName = "") {
    if (!id) return;
    const ref = doc(
        db,
        COLLECTION,
        id
    );

    await updateDoc(
        ref,
        {
            views: increment(1)
        }
    );

    // Lấy thông tin để check milestone
    try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data();
            const currentViews = Number(data.views || 0);
            const cName = characterName || data.name || "Lá Trà";

            // Check milestone
            for (const milestone of VIEW_MILESTONES) {
                if (currentViews === milestone) {
                    createActivity({
                        type: "milestone",
                        action: "view_milestone",
                        characterId: id,
                        characterName: cName,
                        milestone: `view_${milestone}`,
                        title: `🎉 Lá Trà "${cName}" vừa đạt mốc ${milestone.toLocaleString()} lượt xem!`,
                        message: `Khu vườn đang rộn ràng với sự quan tâm của rất nhiều trà hữu.`,
                        read: false
                    });
                    break;
                }
            }
        }
    } catch (e) {
        console.warn("Milestone check error:", e);
    }
}

// =======================
// Xóa
// =======================
export async function removeCharacter(id) {
    await deleteDoc(
        doc(db, COLLECTION, id)
    );
}

// =======================
// GLOBAL STATS
// =======================
export async function getGlobalStats() {
    try {
        const ref = doc(
            db,
            STATS,
            "global"
        );

        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            return {
                visitCount: 0,
                dailyVisits: {}
            };
        }

        return snapshot.data();
    } catch (e) {
        console.warn("Could not get global stats:", e);
        return { visitCount: 0, dailyVisits: {} };
    }
}

export async function increaseVisitCount() {
    try {
        const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const ref = doc(
            db,
            STATS,
            "global"
        );

        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            await setDoc(ref, {
                visitCount: 1,
                dailyVisits: {
                    [todayStr]: 1
                }
            });
            return;
        }

        await updateDoc(ref, {
            visitCount: increment(1),
            [`dailyVisits.${todayStr}`]: increment(1)
        });

        const currentCount = (snapshot.data().visitCount || 0) + 1;

        for (const milestone of VISIT_MILESTONES) {
            if (currentCount === milestone) {
                createActivity({
                    type: "milestone",
                    action: "visit_milestone",
                    milestone: `visit_${milestone}`,
                    title: `🌿 Website vừa chạm mốc ${milestone.toLocaleString()} lượt ghé thăm!`,
                    message: `Cảm ơn mọi người đã cùng xây dựng và chăm sóc Góc của Wey.`,
                    read: false
                });
                break;
            }
        }
    } catch (error) {
        console.warn("Could not update visit count:", error);
    }
}
