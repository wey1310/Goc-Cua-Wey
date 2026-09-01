import { useState } from "react";
import {
    Music,
    Plus,
    Trash2,
    Edit3
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./MusicManager.module.css";

import {
    addMusic,
    updateMusic,
    deleteMusic
} from "../../services/musicService";

function MusicManager({ musicList = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState(null);

    const [formTitle, setFormTitle] = useState("");
    const [formArtist, setFormArtist] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formOrder, setFormOrder] = useState(1);
    const [formDuration, setFormDuration] = useState("");
    const [formActive, setFormActive] = useState(true);

    const [fileName, setFileName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // =========================================================
    // MỞ FORM THÊM
    // =========================================================

    const openAddModal = () => {
        setEditingTrack(null);

        setFormTitle("");
        setFormArtist("");
        setFormUrl("");
        setFormDescription("");
        setFormOrder(musicList.length + 1);
        setFormDuration("");
        setFormActive(true);
        setFileName("");

        setIsModalOpen(true);
    };

    // =========================================================
    // MỞ FORM CHỈNH SỬA
    // =========================================================

    const openEditModal = (track) => {
        setEditingTrack(track);

        setFormTitle(track.title || "");
        setFormArtist(track.artist || "");
        setFormUrl(track.url || "");
        setFormDescription(track.description || "");
        setFormOrder(track.order || 1);
        setFormDuration(track.duration || "");
        setFormActive(track.active !== false);
        setFileName(track.fileName || "");

        setIsModalOpen(true);
    };

    // =========================================================
    // CHỌN FILE MP3 LOCAL
    // =========================================================
    //
    // KHÔNG upload Firebase Storage.
    //
    // File thật phải nằm ở:
    //
    // public/assets/music/
    //
    // Chọn file trên máy chỉ dùng để:
    // - lấy tên file
    // - tự tạo URL local
    // - tự điền tên bài hát
    //
    // =========================================================

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedExtensions = [
            ".mp3",
            ".wav",
            ".ogg"
        ];

        const lowerName = file.name.toLowerCase();

        const isValid = allowedExtensions.some(
            (extension) => lowerName.endsWith(extension)
        );

        if (!isValid) {
            toast.error(
                "Chỉ hỗ trợ file MP3, WAV hoặc OGG."
            );

            e.target.value = "";
            return;
        }

        const localUrl =
            `/assets/music/${encodeURIComponent(file.name)}`;

        setFileName(file.name);
        setFormUrl(localUrl);

        // Nếu chưa nhập tên bài hát
        // thì lấy tên file làm tên bài hát.
        if (!formTitle.trim()) {
            const cleanName = file.name.replace(
                /\.[^/.]+$/,
                ""
            );

            setFormTitle(cleanName);
        }

        toast.success(
            "Đã chọn file nhạc local."
        );

        e.target.value = "";
    };

    // =========================================================
    // LƯU / CẬP NHẬT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formTitle.trim()) {
            toast.error(
                "Vui lòng nhập tên bài hát."
            );
            return;
        }

        if (!formUrl.trim()) {
            toast.error(
                "Vui lòng nhập đường dẫn file MP3."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const musicData = {
                title: formTitle.trim(),
                artist: formArtist.trim(),
                url: formUrl.trim(),
                fileName: fileName.trim(),
                description: formDescription.trim(),
                order: Number(formOrder) || 1,
                duration: formDuration.trim(),
                active: Boolean(formActive)
            };

            // -------------------------------------------------
            // CHỈNH SỬA
            // -------------------------------------------------

            if (editingTrack) {
                await updateMusic(
                    editingTrack.id,
                    musicData
                );

                toast.success(
                    "Đã cập nhật bài hát 🌿"
                );
            }

            // -------------------------------------------------
            // THÊM MỚI
            // -------------------------------------------------

            else {
                await addMusic(musicData);

                toast.success(
                    "Đã thêm bài hát vào thư viện 🎵"
                );
            }

            setIsModalOpen(false);

        } catch (error) {
            console.error(
                "Music save error:",
                error
            );

            toast.error(
                error?.message ||
                "Lỗi khi lưu bài hát."
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================================================
    // BẬT / TẮT BÀI HÁT
    // =========================================================

    const handleToggleActive = async (track) => {
        try {
            await updateMusic(
                track.id,
                {
                    active: !track.active
                }
            );

            toast.success(
                !track.active
                    ? "Đã bật bài hát"
                    : "Đã tắt bài hát"
            );

        } catch (error) {
            console.error(error);

            toast.error(
                "Lỗi cập nhật trạng thái."
            );
        }
    };

    // =========================================================
    // XÓA
    // =========================================================
    //
    // Chỉ xóa document Firestore.
    //
    // File MP3 trong project KHÔNG bị xóa.
    //
    // =========================================================

    const handleDelete = async (track) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa bài hát "${track.title}" khỏi thư viện?`
        );

        if (!confirmed) return;

        try {
            await deleteMusic(track.id);

            toast.success(
                "Đã xóa bài hát khỏi thư viện."
            );

        } catch (error) {
            console.error(error);

            toast.error(
                "Không thể xóa bài hát."
            );
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className={styles.header}>

                <div className={styles.titleArea}>

                    <Music
                        size={22}
                        color="#059669"
                    />

                    <h2 className={styles.title}>
                        Quản Lý Nhạc Nền Vườn Trà
                    </h2>

                    <span
                        className={styles.counterBadge}
                    >
                        {musicList.length} bản nhạc
                    </span>

                </div>

                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={openAddModal}
                >
                    <Plus size={18} />

                    <span>
                        Thêm bài hát mới
                    </span>
                </button>

            </div>


            {/* =================================================
                TRACK LIST
            ================================================= */}

            <div className={styles.trackList}>

                {musicList.length === 0 ? (

                    <div className={styles.empty}>

                        <div
                            style={{
                                fontSize: 36,
                                marginBottom: 8
                            }}
                        >
                            🎵
                        </div>

                        <p>
                            Thư viện nhạc đang trống.
                            Hãy thêm bài hát đầu tiên!
                        </p>

                    </div>

                ) : (

                    musicList.map((track, idx) => (

                        <div
                            key={
                                track.id ||
                                `track-${idx}`
                            }
                            className={styles.trackCard}
                        >

                            {/* ORDER */}

                            <div
                                className={styles.orderBadge}
                            >
                                #{track.order || idx + 1}
                            </div>


                            {/* INFO */}

                            <div
                                className={styles.trackMain}
                            >

                                <h4
                                    className={
                                        styles.trackTitle
                                    }
                                >
                                    {track.title}
                                </h4>

                                {track.artist && (
                                    <p
                                        className={
                                            styles.trackDesc
                                        }
                                    >
                                        ♪ {track.artist}
                                    </p>
                                )}

                                <p
                                    className={
                                        styles.trackDesc
                                    }
                                >
                                    {
                                        track.description ||
                                        "Giai điệu an yên vườn trà"
                                    }
                                </p>

                            </div>


                            {/* AUDIO PLAYER */}

                            <audio
                                controls
                                src={track.url}
                                className={
                                    styles.audioPlayer
                                }
                                preload="none"
                            />


                            {/* STATS */}

                            <div
                                className={
                                    styles.trackStats
                                }
                            >

                                <span>
                                    ▶ {track.playCount || 0} lượt
                                </span>

                                {track.duration && (
                                    <span>
                                        ⏱ {track.duration}
                                    </span>
                                )}

                            </div>


                            {/* ACTIVE */}

                            <button
                                type="button"
                                className={`
                                    ${styles.activeSwitch}
                                    ${
                                        track.active !== false
                                            ? styles.activeOn
                                            : styles.activeOff
                                    }
                                `}
                                onClick={() =>
                                    handleToggleActive(track)
                                }
                                title="Bật/Tắt phát trên website"
                            >
                                {track.active !== false
                                    ? "● Đang phát"
                                    : "○ Ẩn"}
                            </button>


                            {/* ACTIONS */}

                            <div
                                className={
                                    styles.actions
                                }
                            >

                                <button
                                    type="button"
                                    className={
                                        styles.actionBtn
                                    }
                                    onClick={() =>
                                        openEditModal(track)
                                    }
                                    title="Sửa thông tin"
                                >
                                    <Edit3 size={16} />
                                </button>

                                <button
                                    type="button"
                                    className={`
                                        ${styles.actionBtn}
                                        ${styles.actionBtnDanger}
                                    `}
                                    onClick={() =>
                                        handleDelete(track)
                                    }
                                    title="Xóa bài hát"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {isModalOpen && (

                <div
                    className={
                        styles.modalOverlay
                    }
                >

                    <div
                        className={
                            styles.modalContent
                        }
                    >

                        {/* HEADER */}

                        <div
                            className={
                                styles.modalHeader
                            }
                        >

                            <h3
                                className={
                                    styles.modalTitle
                                }
                            >
                                {editingTrack
                                    ? "Chỉnh sửa bài hát"
                                    : "Thêm bài hát mới"}
                            </h3>

                            <button
                                type="button"
                                className={
                                    styles.closeBtn
                                }
                                onClick={() =>
                                    setIsModalOpen(false)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 14
                            }}
                        >

                            {/* TÊN */}

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label
                                    className={
                                        styles.formLabel
                                    }
                                >
                                    Tên bài hát *
                                </label>

                                <input
                                    type="text"
                                    className={
                                        styles.formInput
                                    }
                                    placeholder="Ví dụ: Garden Morning"
                                    value={formTitle}
                                    onChange={(e) =>
                                        setFormTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* ARTIST */}

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label
                                    className={
                                        styles.formLabel
                                    }
                                >
                                    Ca sĩ / Nghệ sĩ
                                </label>

                                <input
                                    type="text"
                                    className={
                                        styles.formInput
                                    }
                                    placeholder="Ví dụ: Minnie, Chi Pu, Ikimonogakari..."
                                    value={formArtist}
                                    onChange={(e) =>
                                        setFormArtist(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* LOCAL FILE */}

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label
                                    className={
                                        styles.formLabel
                                    }
                                >
                                    File nhạc trong project
                                </label>

                                <div
                                    className={
                                        styles.fileInputArea
                                    }
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "music-local-file-input"
                                            )
                                            ?.click()
                                    }
                                >

                                    <Music
                                        size={28}
                                        color="#059669"
                                        style={{
                                            margin:
                                                "0 auto 6px"
                                        }}
                                    />

                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize:
                                                "13.5px",
                                            color:
                                                "#065f46",
                                            fontWeight: 600
                                        }}
                                    >
                                        {fileName
                                            ? `File: ${fileName}`
                                            : "Chọn file MP3 để tự điền đường dẫn"}
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0",
                                            fontSize:
                                                "12px",
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        File phải nằm trong
                                        {" "}
                                        public/assets/music/
                                    </p>

                                    <input
                                        id="music-local-file-input"
                                        type="file"
                                        accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
                                        style={{
                                            display: "none"
                                        }}
                                        onChange={
                                            handleFileChange
                                        }
                                    />

                                </div>

                            </div>


                            {/* URL */}

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label
                                    className={
                                        styles.formLabel
                                    }
                                >
                                    Đường dẫn file nhạc *
                                </label>

                                <input
                                    type="text"
                                    className={
                                        styles.formInput
                                    }
                                    placeholder="/assets/music/ten-file.mp3"
                                    value={formUrl}
                                    onChange={(e) =>
                                        setFormUrl(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <small
                                    style={{
                                        color:
                                            "#64748b",
                                        fontSize: 11.5
                                    }}
                                >
                                    Có thể sửa trực tiếp
                                    đường dẫn này.
                                </small>

                            </div>


                            {/* DESCRIPTION */}

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label
                                    className={
                                        styles.formLabel
                                    }
                                >
                                    Mô tả / Cảm xúc bài hát
                                </label>

                                <input
                                    type="text"
                                    className={
                                        styles.formInput
                                    }
                                    placeholder="Một buổi sớm dịu dàng bên tách trà thơm..."
                                    value={formDescription}
                                    onChange={(e) =>
                                        setFormDescription(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* ORDER + DURATION */}

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: 12
                                }}
                            >

                                <div
                                    className={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        className={
                                            styles.formLabel
                                        }
                                    >
                                        Thứ tự phát
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        className={
                                            styles.formInput
                                        }
                                        value={formOrder}
                                        onChange={(e) =>
                                            setFormOrder(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div
                                    className={
                                        styles.formGroup
                                    }
                                >

                                    <label
                                        className={
                                            styles.formLabel
                                        }
                                    >
                                        Thời lượng
                                        {" "}
                                        (phút:giây)
                                    </label>

                                    <input
                                        type="text"
                                        className={
                                            styles.formInput
                                        }
                                        placeholder="03:20"
                                        value={formDuration}
                                        onChange={(e) =>
                                            setFormDuration(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* ACTIVE */}

                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 8,
                                    marginTop: 4
                                }}
                            >

                                <input
                                    type="checkbox"
                                    id="formActiveCheck"
                                    checked={formActive}
                                    onChange={(e) =>
                                        setFormActive(
                                            e.target.checked
                                        )
                                    }
                                    style={{
                                        width: 16,
                                        height: 16,
                                        cursor: "pointer"
                                    }}
                                />

                                <label
                                    htmlFor="formActiveCheck"
                                    style={{
                                        fontSize: 13.5,
                                        fontWeight: 600,
                                        color: "#064e3b",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cho phép phát trên
                                    danh sách nhạc website
                                </label>

                            </div>


                            {/* FOOTER */}

                            <div
                                className={
                                    styles.modalFooter
                                }
                            >

                                <button
                                    type="button"
                                    className={
                                        styles.cancelBtn
                                    }
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className={
                                        styles.submitBtn
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    {isSubmitting
                                        ? "Đang lưu..."
                                        : editingTrack
                                            ? "Lưu thay đổi"
                                            : "Thêm bài hát"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MusicManager;