import db from "../firebase/firestore";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const COLLECTION = "settings";
const DOC_ID = "global";

export const DEFAULT_SETTINGS = {
    websiteName: "Góc của Wey",
    websiteDesc: "Trang gieo trồng Lá Trà và thưởng thức những câu chuyện trà đạo",
    facebookLink: "https://facebook.com/xsywey1310",
    defaultVolume: 35,
    autoNext: true,
    loopPlaylist: true,
    enableTracking: true
};

/**
 * Lấy settings hiện tại
 */
export async function getSettings() {
    try {
        const ref = doc(db, COLLECTION, DOC_ID);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return {
                ...DEFAULT_SETTINGS,
                ...snap.data()
            };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.warn("Could not load settings from Firestore, using defaults:", error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Realtime listener settings
 */
export function subscribeSettings(callback) {
    try {
        const ref = doc(db, COLLECTION, DOC_ID);
        return onSnapshot(
            ref,
            snap => {
                if (snap.exists()) {
                    callback({
                        ...DEFAULT_SETTINGS,
                        ...snap.data()
                    });
                } else {
                    callback(DEFAULT_SETTINGS);
                }
            },
            error => {
                console.warn("Settings realtime error:", error);
                callback(DEFAULT_SETTINGS);
            }
        );
    } catch (error) {
        console.warn("subscribeSettings failed:", error);
        return () => {};
    }
}

/**
 * Lưu settings
 */
export async function saveSettings(newSettings) {
    try {
        const ref = doc(db, COLLECTION, DOC_ID);
        await setDoc(ref, newSettings, { merge: true });
    } catch (error) {
        console.error("Error saving settings:", error);
        throw error;
    }
}
