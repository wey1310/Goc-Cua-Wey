import styles from "./CharacterForm.module.css";

function CharacterForm({

    form,

    setForm,

    newTag,

    setNewTag,

    addTag,

    removeTag

}){

    const updateField = (field, value) => {

    setForm(prev => ({

        ...prev,

        [field]: value

    }));

};

    return(
        <>
            {form.id && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 14px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    color: "#065f46",
                    marginBottom: "12px"
                }}>
                    <span>👁️ {(form.views || 0).toLocaleString()} views</span>
                    <span>•</span>
                    <span>🍵 {(form.ggaiClick || 0).toLocaleString()} GGAI</span>
                    <span>•</span>
                    <span>📖 {(form.plotClick || 0).toLocaleString()} Plot</span>
                </div>
            )}

            <label>
                Tên
            </label>

            <input

                value={form.name || ""}

                onChange={(e)=>

    updateField(

        "name",

        e.target.value

    )

}

            />

            <label>

                Quote

            </label>

            <textarea

                rows={4}

                value={form.quote || ""}

                onChange={(e)=>

    updateField(

        "quote",

        e.target.value

    )

}

            />

            <label>

                🏷 Tag

            </label>

            <div className={styles.tagBox}>

                {

                    (form.tags || []).map(tag=>(

                        <div

                            key={tag}

                            className={styles.tagChip}

                        >

                            {tag}

                            <button

                                type="button"

                                onClick={()=>removeTag(tag)}

                            >

                                ✕

                            </button>

                        </div>

                    ))

                }

            </div>

            <div className={styles.addTagRow}>

                <input

                    value={newTag}

                    placeholder="Tag mới..."

                    onChange={(e)=>

                        setNewTag(

                            e.target.value

                        )

                    }
                    onKeyDown={(e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        addTag();

    }

}}
                />

                <button

                    type="button"

                    onClick={addTag}

                >

                    Thêm

                </button>

            </div>

            <label>

                GGAI

            </label>

            <input

                value={form.ggai || ""}

                onChange={(e)=>

    updateField(

        "ggai",

        e.target.value

    )

}

            />

            <label>

                Plot

            </label>

            <textarea

                rows={5}

                value={form.plot || ""}

                onChange={(e)=>

    updateField(

        "plot",

        e.target.value

    )

}

            />

        </>

    );

}

export default CharacterForm;