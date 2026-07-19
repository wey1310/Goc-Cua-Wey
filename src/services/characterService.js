import db from "../firebase/firestore";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    increment
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
// Xóa
// =======================

export async function removeCharacter(id) {

    await deleteDoc(
        doc(db, COLLECTION, id)
    );

}