import React, {
    useState,
    useEffect,
    useRef,
    useMemo
} from "react";
import {
    motion,
    AnimatePresence
} from "framer-motion";
import {
    Send,
    Trash2,
    X,
    Search,
    Copy,
    Check,
    Edit3,
    Palette
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./FeedbackPopup.module.css";
import UserAvatar from "../common/UserAvatar";
import {
    GARDEN_THEMES,
    getGardenTheme
} from "../../utils/avatarUtils";
import {
    addFeedback,
    subscribeFeedbacks,
    deleteFeedback
} from "../../services/feedbackService";

function FeedbackPopup({
    character,
    onClose
}) {
    // Current user persistent ID
    const [currentUserId] = useState(() => {
        let id = localStorage.getItem("wey-user-id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("wey-user-id", id);
        }
        return id;
    });

    // Guest Name & Custom Avatar Theme
    const [guestName, setGuestName] = useState(() => {
        return localStorage.getItem("wey-guest-name") || "";
    });

    const [selectedThemeIndex, setSelectedThemeIndex] = useState(() => {
        const saved = localStorage.getItem("wey-avatar-theme-index");
        return saved !== null ? Number(saved) : null;
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [message, setMessage] = useState("");

    // Tab filter for feedbacks: 'this_leaf' | 'all'
    const [tabScope, setTabScope] = useState("this_leaf");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    // Feedbacks list & submission state
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [flyingLeaves, setFlyingLeaves] = useState([]);

    const textareaRef = useRef(null);
    const inputRef = useRef(null);

    const characterId = character?.id;
    const characterName = character?.name || "Vườn Trà";

    // Active theme object
    const activeTheme = useMemo(() => {
        return getGardenTheme(currentUserId || guestName || "guest", selectedThemeIndex);
    }, [currentUserId, guestName, selectedThemeIndex]);

    // Realtime subscription
    useEffect(() => {
        const unsubscribe = subscribeFeedbacks((list) => {
            setAllFeedbacks(list || []);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    // Filter feedback based on scope and search
    const filteredFeedbacks = useMemo(() => {
        let list = allFeedbacks;
        if (tabScope === "this_leaf" && characterId) {
            list = list.filter(item => item.characterId === characterId);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(item =>
                (item.name || "").toLowerCase().includes(q) ||
                (item.message || "").toLowerCase().includes(q) ||
                (item.characterName || "").toLowerCase().includes(q)
            );
        }

        return list;
    }, [allFeedbacks, tabScope, characterId, searchQuery]);

    // Count for current character
    const leafCount = useMemo(() => {
        if (!characterId) return allFeedbacks.length;
        return allFeedbacks.filter(item => item.characterId === characterId).length;
    }, [allFeedbacks, characterId]);

    // Auto-focus on open
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!guestName) {
                setIsEditingProfile(true);
                inputRef.current?.focus();
            } else {
                textareaRef.current?.focus();
            }
        }, 120);
        return () => clearTimeout(timer);
    }, [guestName]);

    // Close on Escape key
    useEffect(() => {
        function handleEscape(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    // Format human-readable relative time
    function formatTime(timestamp) {
        if (!timestamp) return "Vừa xong";
        const diff = (Date.now() - timestamp) / 1000;
        if (diff < 60) return "Vừa xong";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} ngày trước`;
        return new Date(timestamp).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    // Gentle particle leaves on submit
    function createLeaf() {
        return {
            id: crypto.randomUUID(),
            left: 20 + Math.random() * 60,
            rotate: Math.random() * 360,
            delay: Math.random() * 0.2
        };
    }

    // Ctrl+Enter or Cmd+Enter to submit
    function handleKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }

    // Copy message content
    function handleCopyMessage(id, text) {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            toast.success("Đã sao chép lời nhắn 📋");
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => {
            toast.error("Không thể sao chép");
        });
    }

    // Handle theme pick
    function handleSelectTheme(idx) {
        setSelectedThemeIndex(idx);
        localStorage.setItem("wey-avatar-theme-index", String(idx));
        toast.success(`Đã chọn biểu tượng: ${GARDEN_THEMES[idx].label} ${GARDEN_THEMES[idx].icon}`);
    }

    // Submit feedback
    async function handleSubmit() {
        if (isSending) return;

        const name = (guestName || "").trim();
        const text = (message || "").trim();

        if (!name) {
            toast.error("Vui lòng nhập tên hoặc biệt danh của bạn 🍃");
            setIsEditingProfile(true);
            inputRef.current?.focus();
            return;
        }

        if (!text) {
            toast.error("Vui lòng viết đôi dòng gửi tới Lá Trà 🍵");
            textareaRef.current?.focus();
            return;
        }

        // Prevent immediate duplicates
        const duplicated = allFeedbacks.some(
            item => item.userId === currentUserId && item.message === text && item.characterId === (characterId || "")
        );

        if (duplicated) {
            toast.error("Bạn vừa gửi lời nhắn này rồi.");
            return;
        }

        setIsSending(true);
        localStorage.setItem("wey-guest-name", name);

        try {
            await addFeedback({
                characterId,
                characterName,
                userId: currentUserId,
                name,
                message: text
            });

            // Gentle celebration
            const leaves = Array.from({ length: 6 }, () => createLeaf());
            setFlyingLeaves(leaves);
            setTimeout(() => setFlyingLeaves([]), 2000);

            setMessage("");
            toast.success("Đã gửi lời nhắn vào vườn trà 🌿");
            textareaRef.current?.focus();
        } catch (error) {
            console.error("Feedback submit error:", error);
            toast.error("Chưa thể gửi lời nhắn, vui lòng thử lại.");
        } finally {
            setTimeout(() => {
                setIsSending(false);
            }, 250);
        }
    }

    // Delete feedback
    async function handleDelete(id) {
        try {
            await deleteFeedback(id);
            toast.success("Đã xóa lời nhắn.");
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa lời nhắn.");
        }
    }

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.16 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.96, y: 14 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 28,
                stiffness: 320
            }
        },
        exit: {
            opacity: 0,
            scale: 0.97,
            y: 10,
            transition: { duration: 0.16 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, scale: 0.96, transition: { duration: 0.14 } }
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
            >
                {/* Backdrop */}
                <div
                    className={styles.backdrop}
                    onClick={onClose}
                />

                {/* Floating leaves celebration on submit */}
                {flyingLeaves.map(leaf => (
                    <motion.div
                        key={leaf.id}
                        className={styles.flyingLeaf}
                        initial={{
                            opacity: 1,
                            y: 0,
                            rotate: leaf.rotate
                        }}
                        animate={{
                            opacity: 0,
                            y: -220,
                            rotate: leaf.rotate + 180
                        }}
                        transition={{
                            duration: 1.8,
                            delay: leaf.delay,
                            ease: "easeOut"
                        }}
                        style={{
                            left: `${leaf.left}%`
                        }}
                    >
                        🍃
                    </motion.div>
                ))}

                {/* Main Guestbook Card */}
                <motion.div
                    className={styles.modal}
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitleGroup}>
                            <div className={styles.headerIconWrap}>
                                🍃
                            </div>
                            <div className={styles.headerTitles}>
                                <div className={styles.titleRow}>
                                    <h2 className={styles.title}>
                                        Sổ Lưu Bút Vườn Trà
                                    </h2>
                                    {character && (
                                        <span className={styles.targetLeafBadge}>
                                            {characterName}
                                        </span>
                                    )}
                                </div>
                                <p className={styles.subtitle}>
                                    Góc sẻ chia cảm nhận & gửi lời nhắn thương mến
                                </p>
                            </div>
                        </div>

                        <button
                            className={styles.closeBtn}
                            onClick={onClose}
                            title="Đóng lưu bút (ESC)"
                            aria-label="Đóng"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body Content (2 Columns) */}
                    <div className={styles.body}>
                        {/* LEFT COLUMN: Input Form */}
                        <div className={styles.formPanel}>
                            {/* ARTISTIC TEA GUEST CARD (Redesigned Avatar Profile) */}
                            <div
                                className={styles.userCard}
                                style={{
                                    borderColor: activeTheme.border,
                                    background: `linear-gradient(145deg, #ffffff 0%, ${activeTheme.bg} 100%)`
                                }}
                            >
                                <div className={styles.userCardTop}>
                                    {/* Stylized Avatar with Glow */}
                                    <div className={styles.avatarWrap}>
                                        <UserAvatar
                                            name={guestName || "Trà hữu"}
                                            userId={currentUserId}
                                            themeIndex={selectedThemeIndex}
                                            size={52}
                                            showGlow={true}
                                        />
                                        <span
                                            className={styles.avatarSpiritBadge}
                                            style={{
                                                background: activeTheme.bg,
                                                borderColor: activeTheme.border,
                                                color: activeTheme.text
                                            }}
                                            title={activeTheme.label}
                                        >
                                            {activeTheme.icon}
                                        </span>
                                    </div>

                                    {/* Profile Details */}
                                    <div className={styles.userCardInfo}>
                                        <div className={styles.userGreetingLine}>
                                            <span className={styles.userGreetingTitle}>
                                                {guestName ? guestName : "Khách thưởng trà"}
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.editProfileBtn}
                                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                                title={isEditingProfile ? "Thu gọn" : "Tùy chỉnh diện mạo & tên"}
                                            >
                                                {isEditingProfile ? (
                                                    <span>Xong</span>
                                                ) : (
                                                    <>
                                                        <Edit3 size={12} />
                                                        <span>Chỉnh sửa</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className={styles.spiritTagline}>
                                            <span
                                                className={styles.spiritName}
                                                style={{ color: activeTheme.text }}
                                            >
                                                {activeTheme.label}
                                            </span>
                                            <span className={styles.spiritDesc}>
                                                • {activeTheme.desc}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Profile Customizer: Name + 8 Spirit Icons */}
                                <AnimatePresence>
                                    {isEditingProfile && (
                                        <motion.div
                                            className={styles.profileEditSection}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Name input */}
                                            <div className={styles.editFieldBlock}>
                                                <label className={styles.miniLabel} htmlFor="edit-name-input">
                                                    Tên trà hữu của bạn:
                                                </label>
                                                <input
                                                    id="edit-name-input"
                                                    ref={inputRef}
                                                    type="text"
                                                    className={styles.styledNameInput}
                                                    value={guestName}
                                                    maxLength={28}
                                                    onChange={(e) => {
                                                        setGuestName(e.target.value);
                                                        localStorage.setItem("wey-guest-name", e.target.value);
                                                    }}
                                                    placeholder="Nhập biệt danh của bạn..."
                                                />
                                            </div>

                                            {/* 8 Spirit Theme Selector */}
                                            <div className={styles.themePickerBlock}>
                                                <div className={styles.themePickerHeader}>
                                                    <Palette size={12} className="text-[#6e8f49]" />
                                                    <span className={styles.miniLabel}>
                                                        Chọn biểu tượng vườn trà:
                                                    </span>
                                                </div>
                                                <div className={styles.themeGrid}>
                                                    {GARDEN_THEMES.map((themeItem, idx) => {
                                                        const isSelected =
                                                            selectedThemeIndex === idx ||
                                                            (selectedThemeIndex === null && activeTheme.id === themeItem.id);
                                                        return (
                                                            <button
                                                                key={themeItem.id}
                                                                type="button"
                                                                className={`${styles.themeOptionBtn} ${isSelected ? styles.themeOptionActive : ""}`}
                                                                style={{
                                                                    borderColor: isSelected ? themeItem.text : themeItem.border,
                                                                    background: isSelected ? themeItem.bg : "#ffffff"
                                                                }}
                                                                onClick={() => handleSelectTheme(idx)}
                                                                title={`${themeItem.label} - ${themeItem.desc}`}
                                                            >
                                                                <span className={styles.themeOptionEmoji}>
                                                                    {themeItem.icon}
                                                                </span>
                                                                <span
                                                                    className={styles.themeOptionLabel}
                                                                    style={{ color: themeItem.text }}
                                                                >
                                                                    {themeItem.label}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Message Textarea with counter */}
                            <div className={styles.messageFieldContainer}>
                                <div className={styles.labelWithCounter}>
                                    <label className={styles.label} htmlFor="guest-message-input">
                                        Lời nhắn gửi lại
                                    </label>
                                    <span
                                        className={`${styles.charCounter} ${message.length >= 280 ? styles.counterWarning : ""}`}
                                    >
                                        {message.length} / 300
                                    </span>
                                </div>
                                <textarea
                                    id="guest-message-input"
                                    ref={textareaRef}
                                    className={styles.messageTextarea}
                                    value={message}
                                    maxLength={300}
                                    rows={5}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={character ? `Gửi đôi lời cảm nhận tới Lá Trà "${characterName}"...` : "Chia sẻ đôi dòng cùng vườn trà..."}
                                />
                            </div>

                            {/* Action Bar */}
                            <div className={styles.actionRow}>
                                <button
                                    type="button"
                                    className={styles.submitBtn}
                                    onClick={handleSubmit}
                                    disabled={isSending || !message.trim()}
                                >
                                    {isSending ? (
                                        <>
                                            <span className={styles.spinner} />
                                            <span>Đang gửi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Gửi lời nhắn</span>
                                            <Send size={15} />
                                        </>
                                    )}
                                </button>
                                <span className={styles.shortcutHint} title="Nhấn Ctrl + Enter để gửi nhanh">
                                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Recent Feedbacks List */}
                        <div className={styles.listPanel}>
                            {/* List Scope Filter & Search Header */}
                            <div className={styles.listToolbar}>
                                <div className={styles.scopeTabs}>
                                    {character && (
                                        <button
                                            type="button"
                                            className={`${styles.scopeTab} ${tabScope === "this_leaf" ? styles.scopeTabActive : ""}`}
                                            onClick={() => setTabScope("this_leaf")}
                                        >
                                            <span>Lá Trà này</span>
                                            <span className={styles.scopeBadge}>{leafCount}</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className={`${styles.scopeTab} ${tabScope === "all" ? styles.scopeTabActive : ""}`}
                                        onClick={() => setTabScope("all")}
                                    >
                                        <span>Tất cả lưu bút</span>
                                        <span className={styles.scopeBadge}>{allFeedbacks.length}</span>
                                    </button>
                                </div>

                                <div className={styles.searchBox}>
                                    <Search size={14} className="text-[#8b997e]" />
                                    <input
                                        type="text"
                                        placeholder="Tìm lời nhắn..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className={styles.clearSearchBtn}
                                            onClick={() => setSearchQuery("")}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Feedbacks Scroll Container */}
                            <div className={styles.feedbacksScroll}>
                                {filteredFeedbacks.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIconCircle}>
                                            🍵
                                        </div>
                                        <h3 className={styles.emptyTitle}>
                                            {searchQuery ? "Không tìm thấy lời nhắn phù hợp" : "Chưa có lời nhắn nào ở đây"}
                                        </h3>
                                        <p className={styles.emptyText}>
                                            {searchQuery
                                                ? "Thử tìm kiếm với từ khóa khác nhé."
                                                : "Hãy là người đầu tiên để lại một chút hương vị ấm áp trong khu vườn."}
                                        </p>
                                    </div>
                                ) : (
                                    <AnimatePresence initial={false}>
                                        {filteredFeedbacks.map((item) => {
                                            const isAuthor = item.userId === currentUserId;
                                            const isCopied = copiedId === item.id;

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className={`${styles.feedbackCard} ${isAuthor ? styles.myFeedbackCard : ""}`}
                                                >
                                                    {/* Header: User Avatar & Metadata */}
                                                    <div className={styles.cardHeader}>
                                                        <div className={styles.userInfoGroup}>
                                                            <UserAvatar
                                                                name={item.name}
                                                                userId={item.userId}
                                                                size={38}
                                                            />
                                                            <div className={styles.userMeta}>
                                                                <div className={styles.userNameLine}>
                                                                    <strong className={styles.userName}>
                                                                        {item.name || "Ẩn danh"}
                                                                    </strong>
                                                                    {isAuthor && (
                                                                        <span className={styles.youBadge}>
                                                                            Bạn
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className={styles.cardSubLine}>
                                                                    {item.characterName && (
                                                                        <span className={styles.leafTag}>
                                                                            🍃 {item.characterName}
                                                                        </span>
                                                                    )}
                                                                    <span className={styles.dot}>•</span>
                                                                    <span className={styles.timestamp}>
                                                                        {formatTime(item.createdAt)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons: Copy & Delete */}
                                                        <div className={styles.cardActions}>
                                                            <button
                                                                type="button"
                                                                className={styles.iconActionBtn}
                                                                onClick={() => handleCopyMessage(item.id, item.message)}
                                                                title="Sao chép lời nhắn"
                                                            >
                                                                {isCopied ? (
                                                                    <Check size={14} className="text-[#528a2c]" />
                                                                ) : (
                                                                    <Copy size={14} />
                                                                )}
                                                            </button>

                                                            {isAuthor && (
                                                                <button
                                                                    type="button"
                                                                    className={`${styles.iconActionBtn} ${styles.deleteActionBtn}`}
                                                                    onClick={() => handleDelete(item.id)}
                                                                    title="Xóa lời nhắn của bạn"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Feedback Message Content */}
                                                    <p className={styles.messageContent}>
                                                        {item.message}
                                                    </p>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default FeedbackPopup;
