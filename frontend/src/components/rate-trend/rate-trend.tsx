import { useEffect, useMemo, useState } from "react";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

import "./rate-trend.scss";

interface RateTrendProps {
    from: string;
    to: string;
}

interface Point {
    date: string;
    rate: number;
}

const RANGES = [
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
];

export default function RateTrend({ from, to }: RateTrendProps) {
    const [days, setDays] = useState(30);
    const [points, setPoints] = useState<Point[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!from || !to) return;
        let cancelled = false;
        setLoading(true);
        fetch(`/history?from=${from}&to=${to}&days=${days}`)
            .then((r) => r.json())
            .then((json) => {
                if (!cancelled) setPoints(json.history ?? []);
            })
            .catch(() => {
                if (!cancelled) setPoints([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [from, to, days]);

    const stats = useMemo(() => {
        if (!points || points.length < 2) return null;
        const first = points[0].rate;
        const last = points[points.length - 1].rate;
        const changePct = ((last - first) / first) * 100;
        const values = points.map((p) => p.rate);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { first, last, changePct, min, max, up: last >= first };
    }, [points]);

    const path = useMemo(() => {
        if (!points || points.length < 2 || !stats) return null;
        const W = 100;
        const H = 32;
        const span = stats.max - stats.min || 1;
        const step = W / (points.length - 1);
        const coords = points.map((p, i) => {
            const x = i * step;
            const y = H - ((p.rate - stats.min) / span) * (H - 4) - 2;
            return [x, y] as const;
        });
        const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
        const area = `${line} L${W},${H} L0,${H} Z`;
        return { line, area, last: coords[coords.length - 1] };
    }, [points, stats]);

    if (!from || !to) return null;

    const tone = stats?.up ? "up" : "down";

    return (
        <div className={`rate-trend tone-${tone}`}>
            <div className="rate-trend__head">
                <span className="rate-trend__label">{from}/{to} trend</span>
                <div className="rate-trend__ranges">
                    {RANGES.map((r) => (
                        <button
                            key={r.days}
                            type="button"
                            className={r.days === days ? "is-active" : ""}
                            onClick={() => setDays(r.days)}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rate-trend__body">
                {loading && !path && <div className="rate-trend__skeleton" />}

                {!loading && (!path || !stats) && (
                    <div className="rate-trend__empty">Trend unavailable for this pair.</div>
                )}

                {path && stats && (
                    <>
                        <div className="rate-trend__chart-wrap">
                            <svg
                                className="rate-trend__chart"
                                viewBox="0 0 100 32"
                                preserveAspectRatio="none"
                                role="img"
                                aria-label={`${from} to ${to} rate over ${days} days`}
                            >
                                <defs>
                                    <linearGradient id={`fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path className="rate-trend__area" d={path.area} fill={`url(#fill-${tone})`} />
                                <path className="rate-trend__line" d={path.line} pathLength={100} />
                            </svg>
                            {/* Dot as HTML so the non-uniform SVG stretch doesn't flatten it. */}
                            <span
                                className="rate-trend__dot"
                                style={{ top: `${(path.last[1] / 32) * 100}%` }}
                            />
                        </div>

                        <div className={`rate-trend__change tone-${tone}`}>
                            {stats.up ? <HiArrowTrendingUp /> : <HiArrowTrendingDown />}
                            {stats.up ? "+" : ""}
                            {stats.changePct.toFixed(2)}%
                            <span className="rate-trend__period">/ {days}d</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
