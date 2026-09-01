import {
    useState,
    useEffect
} from "react";
import {
    motion,
    AnimatePresence
} from "framer-motion";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Repeat1,
    Music as MusicIcon,
    X
} from "lucide-react";
import styles from "./MusicPopup.module.css";

function formatSeconds(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function MusicPopup({
    isOpen,
    onClose,
    tracks = [],
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    loopMode, // 'off' | 'all' | 'one'
    onSelectTrack,
    onTogglePlay,
    onNextTrack,
    onPrevTrack,
    onSeek,
    onChangeVolume,
    onToggleLoop
}) {
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(volume || 0.35);

    // Sync volume mute state
    useEffect(() => {
        if (volume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    }, [volume]);

    // Handle ESC key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleVolumeToggle = () => {
        if (isMuted) {
            onChangeVolume(prevVolume || 0.35);
            setIsMuted(false);
        } else {
            setPrevVolume(volume);
            onChangeVolume(0);
            setIsMuted(true);
        }
    };

    const activeTracks = tracks.filter(t => t.active !== false);

    const popupVariants = {
        hidden: { opacity: 0, scale: 0.92, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.18, ease: "easeIn" } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className={styles.modal}
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                <MusicIcon size={18} />
                                <span>Giai Điệu Vườn Trà</span>
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={onClose}
                                title="Đóng"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Now Playing Banner */}
                        <div className={styles.nowPlaying}>
                            <div className={styles.trackInfo}>
                                <div className={`${styles.vinylDisc} ${isPlaying ? styles.spinning : ""}`}>
                                    🍵
                                </div>
                                <div className={styles.trackMeta}>
                                    <h4 className={styles.trackTitle}>
                                        {currentTrack?.title || "Chưa chọn bản nhạc"}
                                    </h4>
                                    <p className={styles.trackDesc}>
                                        {currentTrack?.description || "Giai điệu an yên bên tách trà..."}
                                    </p>
                                </div>
                                {isPlaying && (
                                    <div className={styles.equalizer}>
                                        <div className={styles.bar} />
                                        <div className={styles.bar} />
                                        <div className={styles.bar} />
                                        <div className={styles.bar} />
                                    </div>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div className={styles.progressContainer}>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    value={currentTime || 0}
                                    onChange={(e) => onSeek(Number(e.target.value))}
                                    className={styles.progressBar}
                                />
                                <div className={styles.timeRow}>
                                    <span>{formatSeconds(currentTime)}</span>
                                    <span>{formatSeconds(duration)}</span>
                                </div>
                            </div>

                            {/* Playback controls */}
                            <div className={styles.controls}>
                                <button
                                    className={`${styles.ctrlBtn} ${loopMode !== "off" ? styles.activeLoop : ""}`}
                                    onClick={onToggleLoop}
                                    title={
                                        loopMode === "one"
                                            ? "Lặp 1 bài"
                                            : loopMode === "all"
                                            ? "Lặp danh sách"
                                            : "Không lặp"
                                    }
                                >
                                    {loopMode === "one" ? <Repeat1 size={17} /> : <Repeat size={17} />}
                                </button>

                                <button
                                    className={styles.ctrlBtn}
                                    onClick={onPrevTrack}
                                    title="Bài trước"
                                >
                                    <SkipBack size={20} />
                                </button>

                                <button
                                    className={styles.playPauseBtn}
                                    onClick={onTogglePlay}
                                    title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
                                >
                                    {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                                </button>

                                <button
                                    className={styles.ctrlBtn}
                                    onClick={onNextTrack}
                                    title="Bài kế tiếp"
                                >
                                    <SkipForward size={20} />
                                </button>

                                <button
                                    className={styles.ctrlBtn}
                                    onClick={handleVolumeToggle}
                                    title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                                >
                                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                            </div>

                            {/* Volume slider */}
                            <div className={styles.volumeRow}>
                                <Volume2 size={13} style={{ color: "#52b788" }} />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => onChangeVolume(Number(e.target.value))}
                                    className={styles.volumeSlider}
                                />
                                <span style={{ fontSize: "11px", color: "#52b788", minWidth: 26, textAlign: "right" }}>
                                    {Math.round((isMuted ? 0 : volume) * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Playlist Section */}
                        <div className={styles.playlistHeader}>
                            <span>Danh sách phát ({activeTracks.length})</span>
                            <span style={{ fontSize: "11px", color: "#74c69d" }}>🍃 Chạm để phát</span>
                        </div>

                        <div className={styles.trackList}>
                            {activeTracks.length === 0 ? (
                                <div className={styles.emptyList}>
                                    Chưa có bản nhạc nào trong thư viện.
                                </div>
                            ) : (
                                activeTracks.map((track, idx) => {
                                    const isActive = currentTrack?.id === track.id;
                                    return (
                                        <div
                                            key={track.id || idx}
                                            className={`${styles.trackItem} ${isActive ? styles.trackItemActive : ""}`}
                                            onClick={() => onSelectTrack(track)}
                                        >
                                            <div className={styles.trackIndex}>
                                                {isActive && isPlaying ? "▶" : idx + 1}
                                            </div>
                                            <div className={styles.trackItemInfo}>
                                                <h5 className={styles.trackItemTitle}>
                                                    {track.title}
                                                </h5>
                                                <p className={styles.trackItemMeta}>
                                                    {track.description || "Giai điệu an lành"}
                                                </p>
                                            </div>
                                            {track.duration && (
                                                <span className={styles.trackItemDuration}>
                                                    {track.duration}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default MusicPopup;
