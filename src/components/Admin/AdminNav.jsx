import {
    LayoutDashboard,
    Leaf,
    BarChart3,
    Bell,
    MessageCircleHeart,
    Music,
    Settings,
    Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminNav.module.css";

const TABS = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "leaves", label: "Lá Trà", icon: Leaf },
    { id: "statistics", label: "Thống kê", icon: BarChart3 },
    { id: "notifications", label: "Thông báo", icon: Bell, showBadge: "notifications" },
    { id: "feedback", label: "Lời nhắn", icon: MessageCircleHeart, showBadge: "feedback" },
    { id: "music", label: "Nhạc nền", icon: Music },
    { id: "settings", label: "Cài đặt", icon: Settings }
];

function AdminNav({
    activeTab,
    onSelectTab,
    unreadNotificationsCount = 0,
    unreadFeedbacksCount = 0
}) {
    const navigate = useNavigate();

    return (
        <nav className={styles.navContainer}>
            <div className={styles.tabList}>
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const badgeCount =
                        tab.showBadge === "notifications"
                            ? unreadNotificationsCount
                            : tab.showBadge === "feedback"
                            ? unreadFeedbacksCount
                            : 0;

                    return (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
                            onClick={() => onSelectTab(tab.id)}
                        >
                            <Icon size={17} />
                            <span>{tab.label}</span>
                            {badgeCount > 0 && (
                                <span className={styles.badge}>
                                    {badgeCount > 99 ? "99+" : badgeCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className={styles.navActions}>
                <button
                    className={styles.actionBtn}
                    onClick={() => navigate("/home")}
                    title="Về khu vườn trà (Home)"
                >
                    <Home size={16} />
                    <span>Vườn Trà</span>
                </button>
            </div>
        </nav>
    );
}

export default AdminNav;
