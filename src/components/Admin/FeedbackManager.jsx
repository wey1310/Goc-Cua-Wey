import { useState, useMemo } from "react";
import {
    MessageCircleHeart,
    RefreshCw,
    Search,
    Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./FeedbackManager.module.css";
import {
    markFeedbackRead,
    deleteFeedback,
    migrateLocalFeedbacks
} from "../../services/feedbackService";

function formatRelativeTime(timestamp) {
    if (!timestamp) return "Vừa xong";
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return new Date(timestamp).toLocaleDateString("vi-VN");
}

function FeedbackManager({
    feedbacks = [],
    characters = []
}) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCharacterId, setSelectedCharacterId] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'unread' | 'read'
    const [isMigrating, setIsMigrating] = useState(false);

    const unreadCount = useMemo(() => {
        return feedbacks.filter(f => !f.read).length;
    }, [feedbacks]);

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(item => {
            const matchSearch =
                !searchKeyword ||
                (item.name || "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (item.message || "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (item.characterName || "").toLowerCase().includes(searchKeyword.toLowerCase());

            const matchCharacter =
                selectedCharacterId === "all" || item.characterId === selectedCharacterId;

            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "unread" && !item.read) ||
                (statusFilter === "read" && item.read);

            return matchSearch && matchCharacter && matchStatus;
        });
    }, [feedbacks, searchKeyword, selectedCharacterId, statusFilter]);

    const handleSyncLocal = async () => {
        setIsMigrating(true);
        try {
            const count = await migrateLocalFeedbacks(characters);
            if (count > 0) {
                toast.success(`Đã đồng bộ thành công ${count} lời nhắn lên máy chủ 🌿`);
            } else {
                toast.success("Tất cả lời nhắn đã được đồng bộ từ trước!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể đồng bộ lời nhắn.");
        } finally {
            setIsMigrating(false);
        }
    };

    const handleToggleRead = async (id, currentRead) => {
        try {
            await markFeedbackRead(id, !currentRead);
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa lời nhắn này?")) return;
        try {
            await deleteFeedback(id);
            toast.success("Đã xóa lời nhắn");
        } catch (error) {
            toast.error("Lỗi xóa lời nhắn");
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <MessageCircleHeart size={22} color="#059669" />
                    <h2 className={styles.title}>Quản Lý Lời Nhắn Vườn Trà</h2>
                    {unreadCount > 0 && (
                        <span className={styles.counterBadge}>
                            {unreadCount} chưa đọc
                        </span>
                    )}
                </div>

                <button
                    className={styles.syncBtn}
                    onClick={handleSyncLocal}
                    disabled={isMigrating}
                    title="Đồng bộ các lời nhắn lưu tạm từ thiết bị này lên máy chủ"
                >
                    <RefreshCw size={16} className={isMigrating ? "animate-spin" : ""} />
                    <span>{isMigrating ? "Đang đồng bộ..." : "Đồng bộ từ bộ nhớ máy"}</span>
                </button>
            </div>

            {/* Toolbar Filters */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} color="#059669" />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm theo tên hoặc nội dung..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>

                <div className={styles.filterControls}>
                    {/* Character Select */}
                    <select
                        className={styles.selectInput}
                        value={selectedCharacterId}
                        onChange={(e) => setSelectedCharacterId(e.target.value)}
                    >
                        <option value="all">Tất cả Lá Trà ({characters.length})</option>
                        {characters.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Select */}
                    <select
                        className={styles.selectInput}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                    </select>
                </div>
            </div>

            {/* Feedback Cards List */}
            <div className={styles.list}>
                {filteredFeedbacks.length === 0 ? (
                    <div className={styles.empty}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>💌</div>
                        <p>Chưa có lời nhắn nào phù hợp với bộ lọc hiện tại</p>
                    </div>
                ) : (
                    filteredFeedbacks.map(item => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <div className={styles.authorWrap}>
                                    <div className={styles.flowerAvatar}>🌸</div>
                                    <div>
                                        <h4 className={styles.authorName}>{item.name}</h4>
                                        <span className={styles.targetChip}>
                                            🍃 {item.characterName || "Vườn Trà"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.messageBox}>
                                "{item.message}"
                            </div>

                            <div className={styles.cardBottom}>
                                <span className={styles.timeText}>
                                    {formatRelativeTime(item.createdAt)}
                                </span>

                                <div className={styles.cardActions}>
                                    <button
                                        className={`${styles.statusBtn} ${item.read ? styles.readBtn : styles.unreadBtn}`}
                                        onClick={() => handleToggleRead(item.id, item.read)}
                                    >
                                        {item.read ? "✓ Đã đọc" : "● Chưa đọc"}
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(item.id)}
                                        title="Xóa lời nhắn"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FeedbackManager;
