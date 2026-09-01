import React from "react";
import { getGardenTheme } from "../../utils/avatarUtils";

export function UserAvatar({
    name = "Trà hữu",
    userId = "",
    themeIndex = null,
    avatarUrl = "",
    size = 44,
    showGlow = true,
    className = ""
}) {
    const theme = getGardenTheme(userId || name || "guest", themeIndex);

    if (avatarUrl) {
        return (
            <div
                className={`relative rounded-full overflow-hidden flex-shrink-0 border transition-transform duration-200 ${className}`}
                style={{
                    width: size,
                    height: size,
                    borderColor: theme.border,
                    boxShadow: showGlow ? `0 4px 14px ${theme.glow}` : "none"
                }}
            >
                <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={`relative rounded-full flex-shrink-0 flex items-center justify-center select-none transition-all duration-300 ${className}`}
            style={{
                width: size,
                height: size,
                background: theme.gradient,
                border: `2px solid ${theme.border}`,
                boxShadow: showGlow
                    ? `0 6px 18px ${theme.glow}, inset 0 2px 4px rgba(255, 255, 255, 0.8)`
                    : "inset 0 1px 3px rgba(255, 255, 255, 0.7)",
                color: theme.text
            }}
            title={`${name} • ${theme.label}`}
        >
            <span
                className="transform transition-transform duration-200 hover:scale-110"
                style={{
                    fontSize: Math.max(16, Math.floor(size * 0.48)),
                    lineHeight: 1,
                    filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.08))"
                }}
            >
                {theme.icon}
            </span>
        </div>
    );
}

export default UserAvatar;
