import { useEffect, useState } from "react";

import {

    addCharacter,

    updateCharacter,

    removeCharacter

} from "../../services/characterService";

import toast from "react-hot-toast";

import styles from "./LeafEditor.module.css";

import UploadImage from "./UploadImage";
import CharacterForm from "./CharacterForm";
import EditorButtons from "./EditorButtons";
import PreviewModal from "./PreviewModal";

function LeafEditor({

    character,

    refreshCharacters,

    setSelectedCharacter

}) {

    const [form, setForm] = useState(null);

    const [newTag, setNewTag] = useState("");

    const [previewOpen, setPreviewOpen] = useState(false);

    const [saving, setSaving] = useState(false);

    // ================= LOAD =================

    useEffect(() => {

        if (character) {

            setForm(character);

        }

    }, [character]);

    // ================= EMPTY =================

    if (!form) {

        return (

            <div className={styles.empty}>

                🍃

                <h2>

                    Chọn một Lá Trà

                </h2>

            </div>

        );

    }

    // ================= SAVE =================

    const save = async () => {

        const name = form.name?.trim();

const quote = form.quote?.trim();

if (!name) {

    toast.error("Tên không được để trống");

    return;

}

if (!quote) {

    toast.error("Vui lòng nhập Quote");

    return;

}

        if (!form.avatar) {

            toast.error(

                "Vui lòng upload Avatar"

            );

            return;

        }

        try {

            setSaving(true);

            if (form.id) {

                await updateCharacter(form);

            }

            else {

           const {

    id: _,

    ...payload

} = form;

const newId = await addCharacter(

    payload

);

setSelectedCharacter({

    ...form,

    id: newId

});

setSelectedCharacter({

    ...form,

    id: newId

});

            }

            await refreshCharacters();

            toast.success(

                "Đã lưu thành công!"

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.message ||

                "Có lỗi xảy ra."

            );

        }

        finally {

            setSaving(false);

        }

    };

    // ================= DELETE =================

    const remove = async () => {

        if (!form.id) {

            setSelectedCharacter(null);

            return;

        }

        const confirmed = window.confirm(

    "Xóa Lá Trà này?"

);

if (!confirmed) {

    return;

}

        try {

            await removeCharacter(

                form.id

            );

            await refreshCharacters();

            setSelectedCharacter(null);

            toast.success(

                "Đã xóa!"

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

    error.message ||

    "Có lỗi xảy ra."

);

        }

    };
        // ================= DUPLICATE =================

    const duplicate = async () => {

        try {

            const {

                id,

                ...copy

            } = form;

            await addCharacter({

                ...copy,

name: `${form.name || ""} (Copy)`

            });

            await refreshCharacters();

            toast.success(

                "Đã nhân bản!"

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.message ||

                "Không thể nhân bản."

            );

        }

    };

    // ================= TAG =================

    const addTag = () => {

        const tag = newTag.trim();

        if (!tag) return;

        if (

            (form.tags || []).includes(tag)

        ) {

            toast.error(

"Tag đã tồn tại"

);

            return;

        }

        setForm(prev => ({

            ...prev,

            tags: [

                ...(prev.tags || []),

                tag

            ]

        }));

        setNewTag("");

    };

    const removeTag = (tag) => {

        setForm(prev => ({

            ...prev,

            tags: (prev.tags || []).filter(

                item => item !== tag

            )

        }));

    };

    // ================= JSX =================

    return (

        <>

            <div className={styles.container}>

                <UploadImage
    avatar={form.avatar}
    onChange={(url)=>
        setForm(prev=>({
            ...prev,
            avatar:url
        }))
    }
/>

<div className={styles.formArea}>

    <CharacterForm
        form={form}
        setForm={setForm}
        newTag={newTag}
        setNewTag={setNewTag}
        addTag={addTag}
        removeTag={removeTag}
    />

    <EditorButtons
        onSave={save}
        onDelete={remove}
        onDuplicate={duplicate}
        onPreview={()=>
            setPreviewOpen(true)
        }
        saving={saving}
    />

</div>

            </div>

            <PreviewModal

                open={previewOpen}

                character={form}

                onClose={() =>

                    setPreviewOpen(false)

                }

            />

        </>

    );

}

export default LeafEditor;