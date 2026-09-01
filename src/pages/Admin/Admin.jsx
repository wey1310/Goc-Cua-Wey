import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCharacters from "../../hooks/useCharacters";
import styles from "./Admin.module.css";
import homeBtn from "../../assets/ui/home.png";
import leaves from "../../assets/effect/leaves..gif";

// Admin Nav & Tabs
import AdminNav from "../../components/Admin/AdminNav";
import Dashboard from "../../components/Admin/Dashboard";
import Statistics from "../../components/Admin/Statistics";
import NotificationCenter from "../../components/Admin/NotificationCenter";
import FeedbackManager from "../../components/Admin/FeedbackManager";
import MusicManager from "../../components/Admin/MusicManager";
import SettingsManager from "../../components/Admin/SettingsManager";

// Leaves Management components
import Toolbar from "../../components/Admin/Toolbar";
import Sidebar from "../../components/Admin/Sidebar";
import LeafEditor from "../../components/Admin/LeafEditor";

// Services
import { subscribeActivities } from "../../services/activityService";
import { subscribeFeedbacks } from "../../services/feedbackService";
import { subscribeMusic } from "../../services/musicService";
import { getGlobalStats } from "../../services/characterService";

const EMPTY_CHARACTER = {
    name: "",
    avatar: "",
    quote: "",
    tags: [],
    ggai: "",
    plot: "",
    views: 0,
    ggaiClick: 0,
    plotClick: 0,
    leafCount: 1
};

function Admin() {
    const navigate = useNavigate();
    const [characters, , loadCharacters] = useCharacters();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    // Realtime streams
    const [activities, setActivities] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [musicList, setMusicList] = useState([]);
    const [globalStats, setGlobalStats] = useState({ visitCount: 0, dailyVisits: {} });

    // Subscriptions
    useEffect(() => {
        const unsubscribeActivities = subscribeActivities((data) => {
            setActivities(data);
        });

        const unsubscribeFeedbacks = subscribeFeedbacks((data) => {
            setFeedbacks(data);
        });

        const unsubscribeMusic = subscribeMusic((data) => {
            setMusicList(data);
        });

        const fetchStats = async () => {
            const stats = await getGlobalStats();
            if (stats) setGlobalStats(stats);
        };
        fetchStats();
        const statsTimer = setInterval(fetchStats, 30000);

        return () => {
            unsubscribeActivities();
            unsubscribeFeedbacks();
            unsubscribeMusic();
            clearInterval(statsTimer);
        };
    }, []);

    // Counts for Nav Badges
    const unreadNotificationsCount = useMemo(() => {
        return activities.filter(a => !a.read).length;
    }, [activities]);

    const unreadFeedbacksCount = useMemo(() => {
        return feedbacks.filter(f => !f.read).length;
    }, [feedbacks]);

    // Create Character
    const createCharacter = () => {
        setSelectedCharacter({
            ...EMPTY_CHARACTER
        });
    };

    // Filter characters for Leaf management sidebar
    const filteredCharacters = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return characters;

        return characters.filter(item => {
            return (
                (item.name || "").toLowerCase().includes(keyword) ||
                (item.quote || "").toLowerCase().includes(keyword) ||
                (item.ggai || "").toLowerCase().includes(keyword) ||
                (item.plot || "").toLowerCase().includes(keyword) ||
                (item.tags || []).join(" ").toLowerCase().includes(keyword)
            );
        });
    }, [characters, search]);

    return (
        <div className={styles.container}>
            {/* Falling leaves effect */}
            <div className={styles.leafContainer}>
                <img src={leaves} className={styles.leaf1} alt="" />
                <img src={leaves} className={styles.leaf2} alt="" />
                <img src={leaves} className={styles.leaf3} alt="" />
            </div>

            <div className={styles.wrapper}>
                {/* Header Title */}
                <div className={styles.title}>
                    <h1>🍃 Góc của Wey</h1>
                    <p>Trung Tâm Quản Trị & Vườn Trà</p>
                </div>

                {/* Admin Navigation Bar */}
                <AdminNav
                    activeTab={activeTab}
                    onSelectTab={setActiveTab}
                    unreadNotificationsCount={unreadNotificationsCount}
                    unreadFeedbacksCount={unreadFeedbacksCount}
                />

                {/* Tab: Overview (Dashboard) */}
                {activeTab === "overview" && (
                    <Dashboard
                        characters={characters}
                        globalStats={globalStats}
                        feedbacks={feedbacks}
                        activities={activities}
                        musicList={musicList}
                        onNavigateTab={setActiveTab}
                    />
                )}

                {/* Tab: Leaves (Character Management) */}
                {activeTab === "leaves" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <Toolbar
                            search={search}
                            setSearch={setSearch}
                            onAdd={createCharacter}
                        />

                        <div className={styles.panel}>
                            <Sidebar
                                characters={filteredCharacters}
                                onSelect={setSelectedCharacter}
                            />

                            <LeafEditor
                                character={selectedCharacter}
                                refreshCharacters={loadCharacters}
                                setSelectedCharacter={setSelectedCharacter}
                            />
                        </div>
                    </div>
                )}

                {/* Tab: Statistics */}
                {activeTab === "statistics" && (
                    <Statistics
                        characters={characters}
                        globalStats={globalStats}
                        feedbacks={feedbacks}
                        activities={activities}
                    />
                )}

                {/* Tab: Notifications */}
                {activeTab === "notifications" && (
                    <NotificationCenter
                        activities={activities}
                    />
                )}

                {/* Tab: Feedback */}
                {activeTab === "feedback" && (
                    <FeedbackManager
                        feedbacks={feedbacks}
                        characters={characters}
                    />
                )}

                {/* Tab: Music */}
                {activeTab === "music" && (
                    <MusicManager
                        musicList={musicList}
                    />
                )}

                {/* Tab: Settings */}
                {activeTab === "settings" && (
                    <SettingsManager />
                )}
            </div>

            {/* Quick Home button */}
            <button
                className={styles.homeButton}
                onClick={() => navigate("/home")}
                title="Về khu vườn trà"
            >
                <img src={homeBtn} alt="Home" />
            </button>
        </div>
    );
}

export default Admin;
