import db from "../firebase/firestore";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    increment,
    getDoc,
    onSnapshot
} from "firebase/firestore";

const COLLECTION = "characters";

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
        payload
    );

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

export async function increaseGGAIClick(id) {

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

}


// =======================
// Tăng lượt xem
// =======================

export async function increaseView(id) {

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

const STATS = "stats";

export async function getGlobalStats() {

    const ref = doc(
        db,
        STATS,
        "global"
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {

        return {

    visitCount: 0

};

    }

    return snapshot.data();

}

export async function increaseVisitCount() {

    const ref = doc(
        db,
        STATS,
        "global"
    );

    await updateDoc(ref, {

        visitCount: increment(1)

    });

}
