import { useState } from "react";

import { flagUrl, flagFor } from "../../data/currencies";

import "./flag.scss";

interface FlagProps {
    code: string;
    size?: number;
}

// Renders a country flag image for a currency code. Falls back to the emoji
// flag (or globe) if the image can't load — so it degrades gracefully offline.
export default function Flag({ code, size = 30 }: FlagProps) {
    const [failed, setFailed] = useState(false);

    if (!code) return <span className="flag flag--emoji" style={{ fontSize: size * 0.62 }}>🌐</span>;

    if (failed) {
        return (
            <span className="flag flag--emoji" style={{ fontSize: size * 0.62 }}>
                {flagFor(code)}
            </span>
        );
    }

    return (
        <img
            className="flag"
            src={flagUrl(code)}
            alt=""
            width={size}
            height={Math.round(size * 0.72)}
            loading="lazy"
            onError={() => setFailed(true)}
        />
    );
}
