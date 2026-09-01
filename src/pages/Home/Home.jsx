import { useEffect, useMemo, useRef, useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";
import {
    Clock
} from "lucide-react";
import toast from "react-hot-toast";

import styles from "./Home.module.css";
const bg = "/assets/background/home-bg.webp";
import homeHeading from "../../assets/ui/home-heading.png";
import homeMusic from "../../assets/ui/home-music.png";
import homeBack from "../../assets/ui/home-back.png";

import Counter from "../../components/Home/Counter";
import SearchBar from "../../components/Home/SearchBar";
import TagFilter from "../../components/Home/TagFilter";
import LeafCard from "../../components/Home/LeafCard";
import RandomBroad from "../../components/Home/RandomBroad/RandomBroad";
import RankingBroad from "../../components/Home/RankingBroad/RankingBroad";
import CharacterPopup from "../../components/CharacterPopup/CharacterPopup";
import FeedbackPopup from "../../components/FeedbackPopup/FeedbackPopup";
import MusicPopup from "../../components/MusicPopup/MusicPopup";

import useCharacters from "../../hooks/useCharacters";
import {
    getGlobalStats,
    increaseVisitCount,
    increaseView
} from "../../services/characterService";
import {
    subscribeMusic,
    increasePlayCount,
    DEFAULT_MUSIC_TRACKS
} from "../../services/musicService";
import {
    getRecentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed
} from "../../services/preferencesService";
import { getDailyQuote } from "../../data/dailyQuotes";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const audioRef = useRef(null);
    const randomBroadRef = useRef(null);

    const [
        characters,
        setCharacters
    ] = useCharacters(
        location.state?.characters || []
    );

    // ================= MUSIC STATE =================
    const [tracks, setTracks] = useState(DEFAULT_MUSIC_TRACKS);
    const [currentTrack, setCurrentTrack] = useState(DEFAULT_MUSIC_TRACKS[0]);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem("wey-music-volume");
        return saved !== null ? Number(saved) : 0.35;
    });
    const [loopMode, setLoopMode] = useState(() => {
        return localStorage.getItem("wey-music-loop") || "all";
    });
    const [isMusicPopupOpen, setIsMusicPopupOpen] = useState(false);

    // ================= RECENTLY VIEWED =================
    const [recentlyViewedIds, setRecentlyViewedIds] = useState(getRecentlyViewed);

    // ================= FILTERS & SEARCH =================
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [feedbackCharacter, setFeedbackCharacter] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [visitCount, setVisitCount] = useState(0);

    const dailyQuote = useMemo(() => getDailyQuote(), []);

    const teaCount = useMemo(() => {
        return characters.reduce(
            (sum, item) => sum + Number(item.ggaiClick || 0),
            0
        );
    }, [characters]);

    // Sync recently viewed across window events
    useEffect(() => {
        const handleRecentlyViewedChange = (e) => {
            setRecentlyViewedIds(e.detail || getRecentlyViewed());
        };
        window.addEventListener("recentlyViewedChanged", handleRecentlyViewedChange);
        return () => {
            window.removeEventListener("recentlyViewedChanged", handleRecentlyViewedChange);
        };
    }, []);

    // Clear recently viewed history
    const handleClearRecent = () => {
        clearRecentlyViewed();
        toast.success("Đã xóa danh sách ghé thăm gần đây 🍃");
    };

    // ================= SUBSCRIBE MUSIC =================
    useEffect(() => {
        const unsubscribe = subscribeMusic((musicList) => {
            if (musicList && musicList.length > 0) {
                setTracks(musicList);
                const activeOnes = musicList.filter(m => m.active !== false);
                const savedId = localStorage.getItem("wey-selected-music");
                const found = activeOnes.find(m => m.id === savedId) || activeOnes[0] || musicList[0];
                
                setCurrentTrack(prev => {
                    if (!prev || prev.id === "default-garden" || !activeOnes.some(a => a.id === prev.id)) {
                        return found;
                    }
                    return prev;
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Set audio volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle track changes
    useEffect(() => {
        if (!audioRef.current || !currentTrack?.url) return;
        const wasPlaying = playing;
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
        
        if (wasPlaying) {
            audioRef.current.play()
                .then(() => {
                    increasePlayCount(currentTrack.id);
                })
                .catch(err => {
                    console.warn("Autoplay waiting:", err);
                    setPlaying(false);
                });
        }
    }, [currentTrack]);

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.play()
                .then(() => {
                    setPlaying(true);
                    if (currentTrack?.id) {
                        increasePlayCount(currentTrack.id);
                    }
                })
                .catch(console.error);
        }
    };

    const handleSelectTrack = (track) => {
        if (!track) return;
        setCurrentTrack(track);
        localStorage.setItem("wey-selected-music", track.id);
        setPlaying(true);
        if (audioRef.current) {
            audioRef.current.src = track.url;
            audioRef.current.play()
                .then(() => increasePlayCount(track.id))
                .catch(console.error);
        }
    };

    const handleNextTrack = () => {
        const activeTracks = tracks.filter(t => t.active !== false);
        if (activeTracks.length === 0) return;

        const currentIndex = activeTracks.findIndex(t => t.id === currentTrack?.id);
        const nextIndex = (currentIndex + 1) % activeTracks.length;
        handleSelectTrack(activeTracks[nextIndex]);
    };

    const handlePrevTrack = () => {
        const activeTracks = tracks.filter(t => t.active !== false);
        if (activeTracks.length === 0) return;

        const currentIndex = activeTracks.findIndex(t => t.id === currentTrack?.id);
        const prevIndex = (currentIndex - 1 + activeTracks.length) % activeTracks.length;
        handleSelectTrack(activeTracks[prevIndex]);
    };

    const handleSeek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleChangeVolume = (newVol) => {
        setVolume(newVol);
        localStorage.setItem("wey-music-volume", String(newVol));
    };

    const handleToggleLoop = () => {
        const modes = ["off", "all", "one"];
        const currentIndex = modes.indexOf(loopMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setLoopMode(nextMode);
        localStorage.setItem("wey-music-loop", nextMode);
    };

    const handleAudioEnded = () => {
        if (loopMode === "one") {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }
        } else if (loopMode === "all") {
            handleNextTrack();
        } else {
            setPlaying(false);
        }
    };

    // ================= GLOBAL STATS =================
    useEffect(() => {
        async function loadStats() {
            if (!sessionStorage.getItem("visited")) {
                await increaseVisitCount();
                sessionStorage.setItem("visited", "true");
            }
            const stats = await getGlobalStats();
            setVisitCount(stats.visitCount || 0);
        }
        loadStats();
    }, []);

    // Unlock audio on first user click
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (audioRef.current && !playing) {
                audioRef.current.play()
                    .then(() => {
                        setPlaying(true);
                        if (currentTrack?.id) {
                            increasePlayCount(currentTrack.id);
                        }
                    })
                    .catch(() => {});
            }
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
        };

        window.addEventListener("click", handleFirstInteraction);
        window.addEventListener("keydown", handleFirstInteraction);

        return () => {
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
        };
    }, [currentTrack, playing]);

    // ================= TAGS & FILTERING =================
    const tags = useMemo(() => {
        const set = new Set();
        characters.forEach(c => {
            (c.tags || []).forEach(t => set.add(t));
        });
        return Array.from(set);
    }, [characters]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Filter characters client-side (no extra Firestore queries)
    const processedCharacters = useMemo(() => {
        return characters.filter(character => {
            // Search keyword
            const matchKeyword =
                !keyword ||
                (character.name || "").toLowerCase().includes(keyword.toLowerCase()) ||
                (character.quote || "").toLowerCase().includes(keyword.toLowerCase()) ||
                (character.tags || []).some(t =>
                    t.toLowerCase().includes(keyword.toLowerCase())
                );

            // Tags filter
            const matchTags =
                selectedTags.length === 0 ||
                selectedTags.every(t =>
                    (character.tags || []).includes(t)
                );

            return matchKeyword && matchTags;
        });
    }, [characters, keyword, selectedTags]);

    // Recently viewed characters list
    const recentlyViewedCharacters = useMemo(() => {
        if (!recentlyViewedIds || recentlyViewedIds.length === 0) return [];
        const charMap = new Map(characters.map(c => [c.id, c]));
        return recentlyViewedIds
            .map(id => charMap.get(id))
            .filter(Boolean);
    }, [characters, recentlyViewedIds]);

    // ================= CHARACTER POPUP & DISCOVER =================
    const openPopup = (character) => {
        if (!character) return;
        setSelectedCharacter(character);
        addRecentlyViewed(character.id);
        increaseView(character.id, character.name);
    };

    const closePopup = () => {
        setSelectedCharacter(null);
    };

    const increaseTea = () => {
        setCharacters(prev =>
            prev.map(c =>
                c.id === selectedCharacter?.id
                    ? {
                        ...c,
                        ggaiClick: Number(c.ggaiClick || 0) + 1
                    }
                    : c
            )
        );
    };

    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${bg})`
            }}
        >
            {/* Audio element */}
            <audio
                ref={audioRef}
                src={currentTrack?.url || DEFAULT_MUSIC_TRACKS[0].url}
                onTimeUpdate={() => {
                    if (audioRef.current) {
                        setCurrentTime(audioRef.current.currentTime);
                    }
                }}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }}
                onEnded={handleAudioEnded}
                preload="auto"
            />

            {/* Garden Header Brand */}
            <img
                src={homeHeading}
                className={styles.heading}
                alt="Góc của Wey"
            />

            {/* Main Stats Counter */}
            <Counter
                total={characters.length}
                visit={visitCount}
                tea={teaCount}
            />

            {/* Daily Message / Tea Room Welcome Card */}
            <div className={styles.dailyQuoteCard}>
                <div className={styles.dailyQuoteHeader}>
                    <span>🍃 Hôm nay trong khu vườn</span>
                    <span className={styles.dailyQuoteDate}>
                        {new Date().toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit"
                        })}
                    </span>
                </div>
                <p className={styles.dailyQuoteText}>
                    “{dailyQuote.quote}”
                </p>
                <div className={styles.dailyQuoteAuthor}>
                    — {dailyQuote.author}
                </div>
            </div>

            {/* Interactive Broads */}
            <div className={styles.broadSection}>
                <RandomBroad
                    ref={randomBroadRef}
                    characters={processedCharacters}
                    onOpen={openPopup}
                />

                <RankingBroad
                    characters={characters}
                    onOpen={openPopup}
                />
            </div>

            {/* Search Input */}
            <SearchBar
                keyword={keyword}
                setKeyword={setKeyword}
            />

            {/* Tag Filter */}
            <TagFilter
                tags={tags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
            />

            {/* Recently Viewed Section (Rendered only if user has viewed leaves) */}
            {recentlyViewedCharacters.length > 0 && (
                <div className={styles.recentlyViewedContainer}>
                    <div className={styles.recentlyViewedHeader}>
                        <div className={styles.recentlyViewedTitle}>
                            <Clock size={15} className="text-[#6e8f49]" />
                            <span>🍃 Gần đây bạn đã ghé</span>
                        </div>
                        <button
                            type="button"
                            className={styles.clearRecentBtn}
                            onClick={handleClearRecent}
                            title="Xóa lịch sử đã ghé"
                        >
                            Xóa lịch sử
                        </button>
                    </div>

                    <div className={styles.recentCardsScroll}>
                        {recentlyViewedCharacters.map(char => (
                            <button
                                key={char.id}
                                type="button"
                                className={styles.recentCardPill}
                                onClick={() => openPopup(char)}
                                title={`Mở lại "${char.name}"`}
                            >
                                <img
                                    src={char.avatar || "https://placehold.co/100x100?text=Avatar"}
                                    alt={char.name}
                                    className={styles.recentAvatar}
                                />
                                <span className={styles.recentName}>{char.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Character Grid or Empty State */}
            {processedCharacters.length === 0 ? (
                <div className={styles.emptyResultsState}>
                    <div className={styles.emptyCupGraphic}>🍵</div>
                    <h3>Không tìm thấy Lá Trà này...</h3>
                    <p>
                        Thử tìm bằng tên, tag hoặc chủ đề khác nhé.
                    </p>
                    {(keyword || selectedTags.length > 0) && (
                        <button
                            type="button"
                            className={styles.resetFilterBtn}
                            onClick={() => {
                                setKeyword("");
                                setSelectedTags([]);
                            }}
                        >
                            🍃 Xóa tìm kiếm & lọc
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.characterGrid}>
                    {processedCharacters.map(character => (
                        <LeafCard
                            key={character.id}
                            character={character}
                            onClick={() => openPopup(character)}
                        />
                    ))}
                </div>
            )}

            {/* Character Detail Popup (Book Layout) */}
            <CharacterPopup
                character={selectedCharacter}
                onClose={closePopup}
                onTeaIncrease={increaseTea}
            />

            {/* Standalone Feedback Popup (when triggered directly) */}
            {feedbackCharacter && (
                <FeedbackPopup
                    character={feedbackCharacter}
                    onClose={() => setFeedbackCharacter(null)}
                />
            )}

            {/* Music Player Popup */}
            <MusicPopup
                isOpen={isMusicPopupOpen}
                onClose={() => setIsMusicPopupOpen(false)}
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={playing}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                loopMode={loopMode}
                onSelectTrack={handleSelectTrack}
                onTogglePlay={toggleMusic}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
                onSeek={handleSeek}
                onChangeVolume={handleChangeVolume}
                onToggleLoop={handleToggleLoop}
            />

            {/* Fixed Floating Music Button */}
            <button
                className={styles.musicButton}
                onClick={() => setIsMusicPopupOpen(prev => !prev)}
                title="Mở trình phát nhạc vườn trà"
            >
                <img
                    src={homeMusic}
                    alt="Music Player"
                />

                {!playing && (
                    <span className={styles.musicOff}>
                        ✕
                    </span>
                )}
            </button>

            {/* Fixed Floating Back to Landing Button */}
            <button
                className={styles.backButton}
                onClick={() => navigate("/")}
                title="Quay lại trang chào mừng"
            >
                <img
                    src={homeBack}
                    alt="Back"
                />
            </button>
        </div>
    );
}

export default Home;
