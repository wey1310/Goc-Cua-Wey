import { useState, useMemo } from "react";
import {
    BarChart3,
    TrendingUp,
    Flame
} from "lucide-react";
import styles from "./Statistics.module.css";

function formatNumber(num) {
    return (Number(num) || 0).toLocaleString("vi-VN");
}

function Statistics({
    characters = [],
    globalStats = {},
    feedbacks = []
}) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortField, setSortField] = useState("total"); // 'views' | 'ggai' | 'plot' | 'feedback' | 'total' | 'name'
    const [sortAsc, setSortAsc] = useState(false);

    // Calculate feedback count per character map
    const feedbackCountMap = useMemo(() => {
        const map = new Map();
        feedbacks.forEach(f => {
            if (f.characterId) {
                map.set(f.characterId, (map.get(f.characterId) || 0) + 1);
            }
        });
        return map;
    }, [feedbacks]);

    // Compute metrics for characters
    const characterStats = useMemo(() => {
        return characters.map(c => {
            const views = Number(c.views) || 0;
            const ggai = Number(c.ggaiClick) || 0;
            const plot = Number(c.plotClick) || 0;
            const fb = feedbackCountMap.get(c.id) || 0;
            const total = views + ggai + plot + fb;

            return {
                id: c.id,
                name: c.name || "Chưa có tên",
                avatar: c.avatar || "/assets/ui/tea-leaf-card.png",
                tags: c.tags || [],
                views,
                ggai,
                plot,
                feedback: fb,
                total
            };
        });
    }, [characters, feedbackCountMap]);

    // Aggregate totals
    const totalVisits = globalStats.visitCount || 0;
    const totalViews = useMemo(() => characterStats.reduce((s, c) => s + c.views, 0), [characterStats]);
    const totalGGAI = useMemo(() => characterStats.reduce((s, c) => s + c.ggai, 0), [characterStats]);
    const totalPlot = useMemo(() => characterStats.reduce((s, c) => s + c.plot, 0), [characterStats]);
    const totalFeedbacks = feedbacks.length;
    const grandTotal = totalViews + totalGGAI + totalPlot + totalFeedbacks;

    // Daily visits for last 7 days chart
    const last7DaysData = useMemo(() => {
        const dailyVisits = globalStats.dailyVisits || {};
        const result = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
            const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
            const visits = Number(dailyVisits[dateStr]) || 0;
            result.push({
                dateStr,
                dayLabel,
                visits
            });
        }

        const maxVisits = Math.max(...result.map(r => r.visits), 1);
        return result.map(r => ({
            ...r,
            heightPercent: Math.max(Math.round((r.visits / maxVisits) * 100), 12)
        }));
    }, [globalStats]);

    // Today & 7 days & 30 days totals
    const todayStr = new Date().toISOString().split("T")[0];
    const todayVisits = (globalStats.dailyVisits && globalStats.dailyVisits[todayStr]) || 0;

    const last7DaysTotal = useMemo(() => {
        return last7DaysData.reduce((sum, item) => sum + item.visits, 0);
    }, [last7DaysData]);

    // Sort and filter ranking table
    const filteredAndSorted = useMemo(() => {
        let result = characterStats.filter(c => {
            const matchName = c.name.toLowerCase().includes(searchKeyword.toLowerCase());
            const matchTag = c.tags.some(t => t.toLowerCase().includes(searchKeyword.toLowerCase()));
            return matchName || matchTag;
        });

        result.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (typeof valA === "string") {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortAsc ? valA - valB : valB - valA;
        });

        return result;
    }, [characterStats, searchKeyword, sortField, sortAsc]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(prev => !prev);
        } else {
            setSortField(field);
            setSortAsc(false);
        }
    };

    return (
        <div className={styles.statsContainer}>
            {/* 4 Timeframe Cards */}
            <div className={styles.timeframeGrid}>
                <div className={styles.timeframeCard}>
                    <div className={styles.timeframeIcon}>🌟</div>
                    <div className={styles.timeframeInfo}>
                        <p className={styles.timeframeLabel}>Truy cập hôm nay</p>
                        <h3 className={styles.timeframeValue}>{formatNumber(todayVisits)}</h3>
                    </div>
                </div>

                <div className={styles.timeframeCard}>
                    <div className={styles.timeframeIcon}>📅</div>
                    <div className={styles.timeframeInfo}>
                        <p className={styles.timeframeLabel}>7 ngày gần nhất</p>
                        <h3 className={styles.timeframeValue}>{formatNumber(last7DaysTotal)}</h3>
                    </div>
                </div>

                <div className={styles.timeframeCard}>
                    <div className={styles.timeframeIcon}>🌐</div>
                    <div className={styles.timeframeInfo}>
                        <p className={styles.timeframeLabel}>Tổng lượt ghé thăm</p>
                        <h3 className={styles.timeframeValue}>{formatNumber(totalVisits)}</h3>
                    </div>
                </div>

                <div className={styles.timeframeCard}>
                    <div className={styles.timeframeIcon}>🔥</div>
                    <div className={styles.timeframeInfo}>
                        <p className={styles.timeframeLabel}>Tổng tương tác tích lũy</p>
                        <h3 className={styles.timeframeValue}>{formatNumber(grandTotal)}</h3>
                    </div>
                </div>
            </div>

            {/* Visual Charts */}
            <div className={styles.chartsGrid}>
                {/* 7 Days Visit Bar Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h4 className={styles.chartTitle}>
                            <TrendingUp size={18} color="#059669" />
                            <span>Lượt Ghé Thăm 7 Ngày Gần Nhất</span>
                        </h4>
                        <span className={styles.chartSubtitle}>
                            Tổng: {formatNumber(last7DaysTotal)}
                        </span>
                    </div>

                    <div className={styles.barChartContainer}>
                        {last7DaysData.map(d => (
                            <div key={d.dateStr} className={styles.barCol}>
                                <div className={styles.barTrack}>
                                    <div
                                        className={styles.barFill}
                                        style={{ height: `${d.heightPercent}%` }}
                                    >
                                        <span className={styles.barValueTooltip}>
                                            {formatNumber(d.visits)}
                                        </span>
                                    </div>
                                </div>
                                <span className={styles.barLabel}>{d.dayLabel}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interaction Breakdown Progress */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h4 className={styles.chartTitle}>
                            <BarChart3 size={18} color="#059669" />
                            <span>Phân Bổ Tương Tác</span>
                        </h4>
                        <span className={styles.chartSubtitle}>
                            {formatNumber(grandTotal)} điểm
                        </span>
                    </div>

                    <div className={styles.breakdownList}>
                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownRow}>
                                <span>👁️ Lượt xem Lá Trà</span>
                                <span>{formatNumber(totalViews)}</span>
                            </div>
                            <div className={styles.progressBarTrack}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{
                                        width: `${grandTotal ? Math.round((totalViews / grandTotal) * 100) : 0}%`,
                                        background: "linear-gradient(90deg, #6366f1, #818cf8)"
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownRow}>
                                <span>🍵 Lượt thưởng GGAI</span>
                                <span>{formatNumber(totalGGAI)}</span>
                            </div>
                            <div className={styles.progressBarTrack}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{
                                        width: `${grandTotal ? Math.round((totalGGAI / grandTotal) * 100) : 0}%`,
                                        background: "linear-gradient(90deg, #10b981, #34d399)"
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownRow}>
                                <span>📖 Lượt đọc Plot</span>
                                <span>{formatNumber(totalPlot)}</span>
                            </div>
                            <div className={styles.progressBarTrack}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{
                                        width: `${grandTotal ? Math.round((totalPlot / grandTotal) * 100) : 0}%`,
                                        background: "linear-gradient(90deg, #8b5cf6, #a78bfa)"
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.breakdownItem}>
                            <div className={styles.breakdownRow}>
                                <span>💌 Lời nhắn tâm sự</span>
                                <span>{formatNumber(totalFeedbacks)}</span>
                            </div>
                            <div className={styles.progressBarTrack}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{
                                        width: `${grandTotal ? Math.round((totalFeedbacks / grandTotal) * 100) : 0}%`,
                                        background: "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Leaderboard Table */}
            <div className={styles.tableSection}>
                <div className={styles.tableToolbar}>
                    <h3 className={styles.tableTitle}>
                        <Flame size={20} color="#ec4899" />
                        <span>Bảng Xếp Hạng Chi Tiết Lá Trà</span>
                    </h3>

                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="🔍 Tìm kiếm theo tên hoặc tag..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.rankingTable}>
                        <thead>
                            <tr>
                                <th>Hạng</th>
                                <th onClick={() => handleSort("name")}>
                                    Lá Trà {sortField === "name" && (sortAsc ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("views")}>
                                    👁️ Lượt xem {sortField === "views" && (sortAsc ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("ggai")}>
                                    🍵 GGAI {sortField === "ggai" && (sortAsc ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("plot")}>
                                    📖 Plot {sortField === "plot" && (sortAsc ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("feedback")}>
                                    💌 Lời nhắn {sortField === "feedback" && (sortAsc ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("total")}>
                                    🔥 Tổng tương tác {sortField === "total" && (sortAsc ? "▲" : "▼")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSorted.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#059669" }}>
                                        Không tìm thấy lá trà nào phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSorted.map((leaf, index) => {
                                    let rankClass = styles.rankNormal;
                                    if (index === 0) rankClass = styles.rank1;
                                    else if (index === 1) rankClass = styles.rank2;
                                    else if (index === 2) rankClass = styles.rank3;

                                    return (
                                        <tr key={leaf.id}>
                                            <td>
                                                <span className={`${styles.rankBadge} ${rankClass}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.leafCell}>
                                                    <img
                                                        src={leaf.avatar}
                                                        alt={leaf.name}
                                                        className={styles.leafThumb}
                                                    />
                                                    <div>
                                                        <p className={styles.leafName}>{leaf.name}</p>
                                                        <p className={styles.leafTags}>
                                                            {leaf.tags.slice(0, 2).join(", ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatNumber(leaf.views)}</td>
                                            <td>{formatNumber(leaf.ggai)}</td>
                                            <td>{formatNumber(leaf.plot)}</td>
                                            <td>{formatNumber(leaf.feedback)}</td>
                                            <td>
                                                <span className={styles.totalScore}>
                                                    {formatNumber(leaf.total)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Statistics;
