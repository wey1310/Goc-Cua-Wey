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
    increment,
    serverTimestamp
} from "firebase/firestore";

import { createActivity } from "./activityService";

const COLLECTION = "music";

/**
 * Danh sách nhạc có sẵn trong project.
 *
 * File thật phải nằm tại:
 * public/assets/music/
 */
export const DEFAULT_MUSIC_TRACKS = [
    {
        id: "music-01",
        title: "Đợi Hoa Khô Héo Rồi Mới Tưới Nước",
        fileName: "Đợi Hoa Khô Héo Rồi Mới Tưới Nước - Cửa Hàng Tiện Lợi Nhĩ Đóa.mp3",
        url: "/assets/music/Đợi Hoa Khô Héo Rồi Mới Tưới Nước - Cửa Hàng Tiện Lợi Nhĩ Đóa.mp3",
        description: "Cửa Hàng Tiện Lợi Nhĩ Đóa",
        artist: "Cửa Hàng Tiện Lợi Nhĩ Đóa",
        active: true,
        order: 1,
        duration: "03:16",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-02",
        title: "Mưa Là Pháo Hoa Của Thần Linh",
        fileName: "Mưa Là Pháo Hoa Của Thần Linh - Nyxx.mp3",
        url: "/assets/music/Mưa Là Pháo Hoa Của Thần Linh - Nyxx.mp3",
        description: "Nyxx",
        artist: "Nyxx",
        active: true,
        order: 2,
        duration: "03:17",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-03",
        title: "Nhớ nhung đến phát điên",
        fileName: "Nhớ nhung đến phát điên - Cửa hàng tiện lợi Nhĩ Đóa.mp3",
        url: "/assets/music/Nhớ nhung đến phát điên - Cửa hàng tiện lợi Nhĩ Đóa.mp3",
        description: "Cửa Hàng Tiện Lợi Nhĩ Đóa",
        artist: "Cửa hàng tiện lợi Nhĩ Đóa",
        active: true,
        order: 3,
        duration: "02:37",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-04",
        title: "Chưa Bao Giờ",
        fileName: "Chưa Bao Giờ - Chi Pu.mp3",
        url: "/assets/music/Chưa Bao Giờ - Chi Pu.mp3",
        description: "Chi Pu",
        artist: "Chi Pu",
        active: true,
        order: 4,
        duration: "04:26",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-05",
        title: "Gimme Dat Love (Eng Ver)",
        fileName: "Gimme Dat Love - i-dle.mp3",
        url: "/assets/music/Gimme Dat Love - i-dle.mp3",
        description: "(G)I-DLE",
        artist: "(G)I-DLE",
        active: true,
        order: 5,
        duration: "02:46",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-06",
        title: "Mashup HIT Tiktok Trung Douyin 2020",
        fileName: "Mashup HIT Tiktok Trung  Douyin 2020.mp3",
        url: "/assets/music/Mashup HIT Tiktok Trung  Douyin 2020.mp3",
        description: "Nhiều nghệ sĩ",
        artist: "Nhiều nghệ sĩ",
        active: true,
        order: 6,
        duration: "03:51",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-07",
        title: "Sakura",
        fileName: "Sakura - Ikimonogakari.mp3",
        url: "/assets/music/Sakura - Ikimonogakari.mp3",
        description: "Ikimonogakari",
        artist: "Ikimonogakari",
        active: true,
        order: 7,
        duration: "05:57",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    },

    {
        id: "music-08",
        title: "In The Novel - Midnight Sun - Haru Haru (AI Female))",
        fileName: "garden.mp3",
        url: "/assets/music/garden.mp3",
        description: "Minnie - AleXa - AI Make",
        artist: "Minnie - AleXa - AI Make",
        active: true,
        order: 8,
        duration: "07:36",
        playCount: 0,
        source: "local",
        createdAt: Date.now()
    }
];

/**
 * Lấy danh sách nhạc.
 *
 * Nếu Firestore có collection "music":
 * → dùng dữ liệu Firestore.
 *
 * Nếu chưa có:
 * → dùng danh sách nhạc local phía trên.
 */
export async function getMusic() {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("order", "asc")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return DEFAULT_MUSIC_TRACKS;
        }

        return snapshot.docs
            .map(item => ({
                id: item.id,
                ...item.data()
            }))
            .sort(
                (a, b) =>
                    (Number(a.order) || 0) -
                    (Number(b.order) || 0)
            );

    } catch (error) {
        console.warn(
            "Could not load music from Firestore, using local music:",
            error
        );

        return DEFAULT_MUSIC_TRACKS;
    }
}

/**
 * Realtime listener.
 */
export function subscribeMusic(callback) {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("order", "asc")
        );

        return onSnapshot(
            q,
            snapshot => {
                if (snapshot.empty) {
                    callback(DEFAULT_MUSIC_TRACKS);
                    return;
                }

                const list = snapshot.docs
                    .map(item => ({
                        id: item.id,
                        ...item.data()
                    }))
                    .sort(
                        (a, b) =>
                            (Number(a.order) || 0) -
                            (Number(b.order) || 0)
                    );

                callback(list);
            },
            error => {
                console.warn(
                    "Music realtime error, using local music:",
                    error
                );

                callback(DEFAULT_MUSIC_TRACKS);
            }
        );

    } catch (error) {
        console.warn("subscribeMusic failed:", error);

        callback(DEFAULT_MUSIC_TRACKS);

        return () => {};
    }
}

/**
 * Thêm metadata bài hát vào Firestore.
 *
 * Lưu ý:
 * File MP3 KHÔNG được upload.
 * Chỉ lưu thông tin bài hát + URL local.
 */
export async function addMusic({
    title,
    url,
    fileName = "",
    description = "",
    artist = "",
    active = true,
    order = 1,
    duration = ""
}) {
    if (!title || !url) {
        throw new Error(
            "Tên bài hát và đường dẫn MP3 không được để trống."
        );
    }

    const payload = {
        title: title.trim(),
        url: url.trim(),
        fileName: fileName.trim(),
        description: description.trim(),
        artist: artist.trim(),
        active: Boolean(active),
        order: Number(order) || 1,
        duration: duration || "",
        playCount: 0,
        source: "local",
        createdAt: Date.now(),
        serverTime: serverTimestamp()
    };

    const docRef = await addDoc(
        collection(db, COLLECTION),
        payload
    );

    await createActivity({
        type: "music",
        action: "created",
        title: `🎵 Đã thêm bài hát mới: ${title}`,
        message:
            description ||
            `Track "${title}" đã được thêm vào thư viện nhạc.`,
        read: false
    });

    return docRef.id;
}

/**
 * Cập nhật metadata.
 */
export async function updateMusic(id, data) {
    const { id: _, ...payload } = data;

    const refDoc = doc(db, COLLECTION, id);

    await updateDoc(refDoc, {
        ...payload,
        order: Number(payload.order) || 1,
        active: Boolean(payload.active)
    });
}

/**
 * Xóa metadata khỏi Firestore.
 *
 * Không xóa file MP3 vì file nằm trong project.
 */
export async function deleteMusic(id) {
    await deleteDoc(
        doc(db, COLLECTION, id)
    );
}

/**
 * Tăng lượt phát.
 */
const playThrottles = new Map();

export async function increasePlayCount(id) {
    if (!id || id.startsWith("music-")) {
        return;
    }

    const now = Date.now();
    const last = playThrottles.get(id) || 0;

    if (now - last < 15000) {
        return;
    }

    playThrottles.set(id, now);

    try {
        const refDoc = doc(db, COLLECTION, id);

        await updateDoc(refDoc, {
            playCount: increment(1)
        });

    } catch (error) {
        console.warn(
            "Error incrementing play count:",
            error
        );
    }
    }


/**
 * Không còn upload Firebase Storage.
 *
 * Hàm này được giữ lại để tránh lỗi import
 * nếu MusicManager vẫn đang gọi uploadMusicFile().
 *
 * Nó chỉ kiểm tra file và trả về đường dẫn local.
 */
export async function uploadMusicFile(file, onProgress) {
    if (!file) {
        throw new Error("Vui lòng chọn file âm thanh.");
    }

    const allowedExtensions = [
        ".mp3",
        ".wav",
        ".ogg"
    ];

    const fileName = file.name;

    const isValid = allowedExtensions.some(
        ext =>
            fileName.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
        throw new Error(
            "File không đúng định dạng MP3, WAV hoặc OGG."
        );
    }

    /*
     * File đã phải tồn tại trong:
     *
     * public/assets/music/
     *
     * Browser không thể tự ghi file vào
     * public/assets/music/ trên Vercel.
     */

    if (onProgress) {
        onProgress(100);
    }

    return {
        url: `/assets/music/${encodeURIComponent(fileName)}`,
        fileName,
        storagePath: "",
        duration: ""
    };
}