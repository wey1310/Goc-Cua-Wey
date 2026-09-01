import { useState, useMemo } from "react";
import {
    Bell,
    CheckCheck,
    Trash2,
    Check
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./NotificationCenter.module.css";
import {
    markActivityRead,
    markAllActivitiesRead,
    deleteActivity,
    clearAllActivities
} from "../../services/activityService";

function formatRelativeTime(timestamp) {
    if (!timestamp) return "Vừa xong";
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return new Date(timestamp).toLocaleDateString("vi-VN");
}

function NotificationCenter({
    activities = []
}) {
    const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'milestone' | 'feedback' | 'interaction'

    const unreadCount = useMemo(() => {
        return activities.filter(a => !a.read).length;
    }, [activities]);

    const filteredList = useMemo(() => {
        return activities.filter(item => {
            if (filter === "unread") return !item.read;
            if (filter === "read") return item.read;
            if (filter === "milestone") return item.type === "milestone";
            if (filter === "feedback") return item.type === "feedback";
            if (filter === "interaction") return ["view", "ggai", "plot", "music"].includes(item.type);
            return true;
        });
    }, [activities, filter]);

    const handleMarkAllRead = async () => {
        try {
            await markAllActivitiesRead(activities);
            toast.success("Đã đánh dấu tất cả đã đọc 🌿");
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ thông báo?")) return;
        try {
            await clearAllActivities(activities);
            toast.success("Đã dọn sạch thông báo");
        } catch (error) {
            toast.error("Không thể xóa thông báo");
        }
    };

    const handleToggleRead = async (id, currentRead) => {
        try {
            await markActivityRead(id, !currentRead);
        } catch (error) {
            toast.error("Lỗi cập nhật");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteActivity(id);
            toast.success("Đã xóa thông báo");
        } catch (error) {
            toast.error("Lỗi xóa thông báo");
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <Bell size={22} color="#059669" />
                    <h2 className={styles.title}>Trung Tâm Thông Báo</h2>
                    {unreadCount > 0 && (
                        <span className={styles.unreadCount}>
                            {unreadCount} chưa đọc
                        </span>
                    )}
                </div>

                <div className={styles.actions}>
                    {unreadCount > 0 && (
                        <button
                            className={styles.btnPrimary}
                            onClick={handleMarkAllRead}
                        >
                            <CheckCheck size={16} />
                            <span>Đánh dấu tất cả đã đọc</span>
                        </button>
                    )}

                    {activities.length > 0 && (
                        <button
                            className={styles.btnSecondary}
                            onClick={handleClearAll}
                        >
                            <Trash2 size={16} />
                            <span>Xóa tất cả</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterRow}>
                <button
                    className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter("all")}
                >
                    Tất cả ({activities.length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === "unread" ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter("unread")}
                >
                    Chưa đọc ({unreadCount})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === "milestone" ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter("milestone")}
                >
                    🎉 Cột mốc
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === "feedback" ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter("feedback")}
                >
                    💌 Lời nhắn
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === "interaction" ? styles.filterBtnActive : ""}`}
                    onClick={() => setFilter("interaction")}
                >
                    🍵 Tương tác Lá Trà
                </button>
            </div>

            {/* Notification List */}
            <div className={styles.list}>
                {filteredList.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🌿</div>
                        <p>Không có thông báo nào trong mục này</p>
                    </div>
                ) : (
                    filteredList.map(item => {
                        let icon = "🍃";
                        if (item.type === "milestone") icon = "🎉";
                        else if (item.type === "feedback") icon = "💌";
                        else if (item.type === "ggai") icon = "🍵";
                        else if (item.type === "plot") icon = "📖";
                        else if (item.type === "music") icon = "🎵";
                        else if (item.type === "view") icon = "👁️";

                        return (
                            <div
                                key={item.id}
                                className={`${styles.card} ${!item.read ? styles.unreadCard : ""}`}
                            >
                                <div className={styles.iconWrap}>{icon}</div>
                                <div className={styles.body}>
                                    <div className={styles.topRow}>
                                        <h4 className={styles.itemTitle}>{item.title}</h4>
                                        <span className={styles.itemTime}>
                                            {formatRelativeTime(item.createdAt)}
                                        </span>
                                    </div>
                                    {item.message && (
                                        <p className={styles.itemMessage}>{item.message}</p>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => handleToggleRead(item.id, item.read)}
                                        title={item.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                                    >
                                        <Check size={16} color={item.read ? "#059669" : "#10b981"} />
                                    </button>
                                    <button
                                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                        onClick={() => handleDelete(item.id)}
                                        title="Xóa thông báo"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default NotificationCenter;
