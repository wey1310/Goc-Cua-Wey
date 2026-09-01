import { useState, useEffect } from "react";
import {
    Settings,
    Globe,
    Music,
    Shield,
    Save
} from "lucide-react";
import toast from "react-hot-toast";
import styles from "./SettingsManager.module.css";
import {
    getSettings,
    saveSettings,
    DEFAULT_SETTINGS
} from "../../services/settingsService";

function SettingsManager() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getSettings().then(data => {
            if (data) setSettings(data);
        });
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await saveSettings(settings);
            toast.success("Đã lưu cấu hình Góc của Wey thành công 🌿");
        } catch (error) {
            console.error(error);
            toast.error("Không thể lưu cấu hình.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <Settings size={22} color="#059669" />
                    <h2 className={styles.title}>Cài Đặt Hệ Thống Vườn Trà</h2>
                </div>

                <button
                    type="submit"
                    className={styles.saveBtn}
                    disabled={isSaving}
                >
                    <Save size={18} />
                    <span>{isSaving ? "Đang lưu..." : "Lưu Cài Đặt"}</span>
                </button>
            </div>

            {/* Website Section */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    <Globe size={18} />
                    <span>Thông Tin Website</span>
                </h3>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Tên Website</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={settings.websiteName || ""}
                            onChange={(e) => handleChange("websiteName", e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Link Facebook kết nối</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={settings.facebookLink || ""}
                            onChange={(e) => handleChange("facebookLink", e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Khẩu hiệu / Giới thiệu</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        value={settings.websiteDesc || ""}
                        onChange={(e) => handleChange("websiteDesc", e.target.value)}
                    />
                </div>
            </div>

            {/* Music Player Settings */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    <Music size={18} />
                    <span>Cấu Hình Trình Phát Nhạc</span>
                </h3>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Âm lượng khởi tạo mặc định (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className={styles.formInput}
                            value={settings.defaultVolume ?? 35}
                            onChange={(e) => handleChange("defaultVolume", Number(e.target.value))}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={settings.autoNext ?? true}
                            onChange={(e) => handleChange("autoNext", e.target.checked)}
                            style={{ width: 16, height: 16 }}
                        />
                        <span>Tự động chuyển bài kế tiếp khi bài hát kết thúc</span>
                    </label>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={settings.loopPlaylist ?? true}
                            onChange={(e) => handleChange("loopPlaylist", e.target.checked)}
                            style={{ width: 16, height: 16 }}
                        />
                        <span>Mặc định lặp lại toàn bộ danh sách phát (Loop Playlist)</span>
                    </label>
                </div>
            </div>

            {/* Analytics & System */}
            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>
                    <Shield size={18} />
                    <span>Nhật Ký & Thống Kê</span>
                </h3>

                <label className={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        checked={settings.enableTracking ?? true}
                        onChange={(e) => handleChange("enableTracking", e.target.checked)}
                        style={{ width: 16, height: 16 }}
                    />
                    <span>Bật ghi nhận lượt xem, lượt click GGAI, Plot và thông báo cột mốc</span>
                </label>
            </div>
        </form>
    );
}

export default SettingsManager;
