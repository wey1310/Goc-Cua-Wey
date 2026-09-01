import { useMemo } from "react";
import {
    Flame,
    Trophy,
    Music,
    MessageCircleHeart,
    BellRing
} from "lucide-react";
import styles from "./Dashboard.module.css";

function formatNumber(num) {
    return (Number(num) || 0).toLocaleString("vi-VN");
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return "Vừa xong";
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return new Date(timestamp).toLocaleDateString("vi-VN");
}

function Dashboard({
    characters = [],
    globalStats = {},
    feedbacks = [],
    activities = [],
    musicList = [],
    onNavigateTab
}) {
    // Totals calculations
    const totalLeaves = characters.length;
    const totalVisits = globalStats.visitCount || 0;

    const totalViews = useMemo(() => {
        return characters.reduce((sum, c) => sum + (Number(c.views) || 0), 0);
    }, [characters]);

    const totalGGAI = useMemo(() => {
        return characters.reduce((sum, c) => sum + (Number(c.ggaiClick) || 0), 0);
    }, [characters]);

    const totalPlot = useMemo(() => {
        return characters.reduce((sum, c) => sum + (Number(c.plotClick) || 0), 0);
    }, [characters]);

    const totalFeedbacks = feedbacks.length;

    const totalInteractions = useMemo(() => {
        return totalViews + totalGGAI + totalPlot + totalFeedbacks;
    }, [totalViews, totalGGAI, totalPlot, totalFeedbacks]);

    // Top viewed leaf
    const topViewedLeaf = useMemo(() => {
        if (!characters.length) return null;
        return [...characters].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))[0];
    }, [characters]);

    // Top interactive leaf
    const topInteractiveLeaf = useMemo(() => {
        if (!characters.length) return null;
        return [...characters].sort((a, b) => {
            const scoreA = (Number(a.views) || 0) + (Number(a.ggaiClick) || 0) * 2 + (Number(a.plotClick) || 0) * 2;
            const scoreB = (Number(b.views) || 0) + (Number(b.ggaiClick) || 0) * 2 + (Number(b.plotClick) || 0) * 2;
            return scoreB - scoreA;
        })[0];
    }, [characters]);

    // Latest feedback
    const latestFeedback = useMemo(() => {
        return feedbacks.length ? feedbacks[0] : null;
    }, [feedbacks]);

    // Top played or active music track
    const topMusicTrack = useMemo(() => {
        if (!musicList.length) return null;
        return [...musicList].sort((a, b) => (Number(b.playCount) || 0) - (Number(a.playCount) || 0))[0];
    }, [musicList]);

    // Recent 4 activities
    const recentActivities = useMemo(() => {
        return activities.slice(0, 5);
    }, [activities]);

    const statCards = [
        {
            id: "leaves",
            tab: "leaves",
            icon: "🍃",
            label: "Tổng Lá Trà",
            value: totalLeaves,
            color: "#10b981"
        },
        {
            id: "visits",
            tab: "statistics",
            icon: "🌐",
            label: "Lượt Truy Cập",
            value: totalVisits,
            color: "#3b82f6"
        },
        {
            id: "views",
            tab: "statistics",
            icon: "👁️",
            label: "Lượt Xem Lá Trà",
            value: totalViews,
            color: "#6366f1"
        },
        {
            id: "ggai",
            tab: "statistics",
            icon: "🍵",
            label: "Lượt Thưởng GGAI",
            value: totalGGAI,
            color: "#14b8a6"
        },
        {
            id: "plot",
            tab: "statistics",
            icon: "📖",
            label: "Lượt Đọc Plot",
            value: totalPlot,
            color: "#8b5cf6"
        },
        {
            id: "feedback",
            tab: "feedback",
            icon: "💌",
            label: "Tổng Lời Nhắn",
            value: totalFeedbacks,
            color: "#f59e0b"
        },
        {
            id: "interactions",
            tab: "statistics",
            icon: "💖",
            label: "Tổng Tương Tác",
            value: totalInteractions,
            color: "#ec4899"
        }
    ];

    return (
        <div className={styles.dashboardContainer}>
            {/* 7 Stat Cards */}
            <div className={styles.statsGrid}>
                {statCards.map(card => (
                    <div
                        key={card.id}
                        className={styles.statCard}
                        onClick={() => onNavigateTab?.(card.tab)}
                        title={`Chuyển tới tab ${card.label}`}
                    >
                        <div className={styles.cardHeader}>
                            <span className={styles.cardIcon}>{card.icon}</span>
                            <span className={styles.cardArrow}>Xem →</span>
                        </div>
                        <div>
                            <div className={styles.cardValue}>
                                {formatNumber(card.value)}
                            </div>
                            <p className={styles.cardLabel}>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4 Feature Highlights */}
            <div className={styles.highlightsGrid}>
                {/* Top Viewed Leaf */}
                <div className={styles.highlightCard}>
                    <h4 className={styles.highlightTitle}>
                        <Trophy size={18} color="#f59e0b" />
                        <span>Lá Trà Được Xem Nhiều Nhất</span>
                    </h4>
                    {topViewedLeaf ? (
                        <div className={styles.highlightContent}>
                            <img
                                src={topViewedLeaf.avatar || "/assets/ui/tea-leaf-card.png"}
                                alt={topViewedLeaf.name}
                                className={styles.highlightAvatar}
                            />
                            <div className={styles.highlightInfo}>
                                <h5 className={styles.highlightName}>{topViewedLeaf.name}</h5>
                                <p className={styles.highlightStat}>
                                    👁️ {formatNumber(topViewedLeaf.views || 0)} lượt xem
                                </p>
                                <div className={styles.tagRow}>
                                    {(topViewedLeaf.tags || []).slice(0, 2).map(tag => (
                                        <span key={tag} className={styles.tagChip}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyBox}>Chưa có dữ liệu lá trà</div>
                    )}
                </div>

                {/* Top Interactive Leaf */}
                <div className={styles.highlightCard}>
                    <h4 className={styles.highlightTitle}>
                        <Flame size={18} color="#ec4899" />
                        <span>Lá Trà Tương Tác Sôi Nổi</span>
                    </h4>
                    {topInteractiveLeaf ? (
                        <div className={styles.highlightContent}>
                            <img
                                src={topInteractiveLeaf.avatar || "/assets/ui/tea-leaf-card.png"}
                                alt={topInteractiveLeaf.name}
                                className={styles.highlightAvatar}
                            />
                            <div className={styles.highlightInfo}>
                                <h5 className={styles.highlightName}>{topInteractiveLeaf.name}</h5>
                                <p className={styles.highlightStat}>
                                    🍵 {formatNumber(topInteractiveLeaf.ggaiClick || 0)} GGAI • 📖 {formatNumber(topInteractiveLeaf.plotClick || 0)} Plot
                                </p>
                                <div className={styles.tagRow}>
                                    {(topInteractiveLeaf.tags || []).slice(0, 2).map(tag => (
                                        <span key={tag} className={styles.tagChip}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyBox}>Chưa có dữ liệu tương tác</div>
                    )}
                </div>

                {/* Latest Feedback */}
                <div className={styles.highlightCard}>
                    <h4 className={styles.highlightTitle}>
                        <MessageCircleHeart size={18} color="#ea580c" />
                        <span>Lời Nhắn Mới Nhất</span>
                    </h4>
                    {latestFeedback ? (
                        <div className={styles.feedbackSnippet}>
                            <div className={styles.feedbackHeader}>
                                <span className={styles.feedbackAuthor}>
                                    🌸 {latestFeedback.name}
                                </span>
                                <span className={styles.feedbackTarget}>
                                    {latestFeedback.characterName || "Vườn Trà"}
                                </span>
                            </div>
                            <p className={styles.feedbackText}>
                                "{latestFeedback.message}"
                            </p>
                        </div>
                    ) : (
                        <div className={styles.emptyBox}>Chưa có lời nhắn nào</div>
                    )}
                </div>

                {/* Music Highlight */}
                <div className={styles.highlightCard}>
                    <h4 className={styles.highlightTitle}>
                        <Music size={18} color="#6366f1" />
                        <span>Giai Điệu Vườn Trà</span>
                    </h4>
                    {topMusicTrack ? (
                        <div className={styles.musicSnippet}>
                            <div className={styles.musicDisc}>🎵</div>
                            <div className={styles.musicInfo}>
                                <h5 className={styles.musicTitle}>{topMusicTrack.title}</h5>
                                <p className={styles.musicStats}>
                                    ▶ {formatNumber(topMusicTrack.playCount || 0)} lượt phát {topMusicTrack.duration ? `• ${topMusicTrack.duration}` : ""}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyBox}>Chưa có bản nhạc nào</div>
                    )}
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className={styles.activitySection}>
                <div className={styles.activityHeader}>
                    <h3>
                        <BellRing size={19} color="#059669" />
                        <span>Nhật Ký Hoạt Động Vườn Trà</span>
                    </h3>
                    <button
                        className={styles.viewAllBtn}
                        onClick={() => onNavigateTab?.("notifications")}
                    >
                        Xem tất cả thông báo →
                    </button>
                </div>

                {recentActivities.length === 0 ? (
                    <div className={styles.emptyBox}>
                        🌿 Vườn trà đang rất yên bình, chưa có hoạt động mới nào.
                    </div>
                ) : (
                    <div className={styles.activityList}>
                        {recentActivities.map(act => {
                            let icon = "🍃";
                            if (act.type === "milestone") icon = "🎉";
                            else if (act.type === "feedback") icon = "💌";
                            else if (act.type === "ggai") icon = "🍵";
                            else if (act.type === "plot") icon = "📖";
                            else if (act.type === "music") icon = "🎵";
                            else if (act.type === "view") icon = "👁️";

                            return (
                                <div key={act.id} className={styles.activityItem}>
                                    <span className={styles.activityIcon}>{icon}</span>
                                    <div className={styles.activityBody}>
                                        <div className={styles.activityTitle}>{act.title}</div>
                                        {act.message && (
                                            <p className={styles.activityMessage}>{act.message}</p>
                                        )}
                                    </div>
                                    <span className={styles.activityTime}>
                                        {formatRelativeTime(act.createdAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
