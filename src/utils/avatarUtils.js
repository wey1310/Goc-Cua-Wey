// 8 curated botanical & celestial tea garden spirits
export const GARDEN_THEMES = [
    {
        id: "tea_leaf",
        icon: "🍃",
        label: "Lá Trà Xanh",
        desc: "Thanh thuần & tĩnh tại",
        bg: "#EBF5E9",
        border: "#B2D8A6",
        text: "#2C6B2F",
        glow: "rgba(82, 160, 80, 0.25)",
        gradient: "linear-gradient(135deg, #F1F9EE 0%, #D8ECD0 100%)"
    },
    {
        id: "sprout",
        icon: "🌱",
        label: "Mầm Nhỏ",
        desc: "Tươi mới & hy vọng",
        bg: "#F2F9E8",
        border: "#C7E5A4",
        text: "#4B7C23",
        glow: "rgba(105, 172, 45, 0.25)",
        gradient: "linear-gradient(135deg, #F7FCF0 0%, #DCF0BE 100%)"
    },
    {
        id: "blossom",
        icon: "🌸",
        label: "Hoa Đào",
        desc: "Dịu dàng & thơ mộng",
        bg: "#FDF0F4",
        border: "#F7C0D2",
        text: "#B8235A",
        glow: "rgba(224, 76, 126, 0.25)",
        gradient: "linear-gradient(135deg, #FFF5F8 0%, #FCD5E2 100%)"
    },
    {
        id: "teacup",
        icon: "☕",
        label: "Tách Trà Ấm",
        desc: "Mộc mạc & nồng hậu",
        bg: "#F5EFEA",
        border: "#D5C4B5",
        text: "#68483B",
        glow: "rgba(138, 98, 77, 0.22)",
        gradient: "linear-gradient(135deg, #FAF6F3 0%, #E8DDD4 100%)"
    },
    {
        id: "moon",
        icon: "🌙",
        label: "Trăng Khuyết",
        desc: "Huyền ảo & sâu lắng",
        bg: "#F0ECF8",
        border: "#CBC0E8",
        text: "#5232A4",
        glow: "rgba(115, 80, 204, 0.24)",
        gradient: "linear-gradient(135deg, #F6F3FC 0%, #DDD4F4 100%)"
    },
    {
        id: "star",
        icon: "⭐",
        label: "Sao Mai",
        desc: "Sáng trong & ấm áp",
        bg: "#FFFBE8",
        border: "#FFECA1",
        text: "#B87309",
        glow: "rgba(235, 155, 20, 0.25)",
        gradient: "linear-gradient(135deg, #FFFDF2 0%, #FFEBA6 100%)"
    },
    {
        id: "lotus",
        icon: "🪷",
        label: "Sen Hồng",
        desc: "Thanh tao & an nhiên",
        bg: "#FBF0F2",
        border: "#F5C2CD",
        text: "#A6324D",
        glow: "rgba(206, 68, 98, 0.22)",
        gradient: "linear-gradient(135deg, #FFF6F7 0%, #F9D5DD 100%)"
    },
    {
        id: "chamomile",
        icon: "🌼",
        label: "Cúc Vàng",
        desc: "Hồn nhiên & rạng rỡ",
        bg: "#FFF9E6",
        border: "#FCE59F",
        text: "#B87B00",
        glow: "rgba(230, 160, 0, 0.22)",
        gradient: "linear-gradient(135deg, #FFFDF2 0%, #FDE49E 100%)"
    }
];

export function hashSeed(str = "") {
    let hash = 0;
    const cleanStr = String(str).trim().toLowerCase();
    for (let i = 0; i < cleanStr.length; i++) {
        hash = cleanStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export function getGardenTheme(seed = "guest", customThemeIndex = null) {
    if (typeof customThemeIndex === "number" && customThemeIndex >= 0 && customThemeIndex < GARDEN_THEMES.length) {
        return GARDEN_THEMES[customThemeIndex];
    }
    const hash = hashSeed(seed);
    return GARDEN_THEMES[hash % GARDEN_THEMES.length];
}
