import { useEffect, useMemo, useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

import Input from "../input/input";
import CurrencyButton from "../currency-button/currency-button";
import CurrencyPicker from "../currency-picker/currency-picker";
import RateTrend from "../rate-trend/rate-trend";
import Markets from "../markets/markets";
import { symbolFor } from "../../data/currencies";
import { convertAmount, formatMoney, formatRate } from "../../utils/format";

import "./convert.scss";

type Side = "from" | "to";

const DEFAULTS = { from: "USD", to: "EUR", amount: "1" };

// Read a saved selection, treating an empty string as "not set".
function saved(key: keyof typeof DEFAULTS): string {
    const v = localStorage.getItem(key);
    return v === null || v === "" ? DEFAULTS[key] : v;
}

export default function Convert() {
    const [rates, setRates] = useState<Record<string, number> | null>(null);
    const [error, setError] = useState(false);
    // Hydrate selection synchronously from localStorage so the first paint is
    // already populated (no race with the async rates fetch).
    const [from, setFrom] = useState(() => saved("from"));
    const [to, setTo] = useState(() => saved("to"));
    const [amount, setAmount] = useState(() => saved("amount"));
    const [picker, setPicker] = useState<Side | null>(null);

    // Load live rates once; drop any saved code the API no longer provides.
    useEffect(() => {
        fetch("/rates", { headers: { "Content-Type": "application/json" } })
            .then((r) => r.json())
            .then((json: Record<string, number>) => {
                if (!json || typeof json !== "object" || Object.keys(json).length === 0) {
                    throw new Error("empty rates");
                }
                setRates(json);
                setFrom((f) => (json[f] ? f : DEFAULTS.from));
                setTo((t) => (json[t] ? t : DEFAULTS.to));
            })
            .catch(() => setError(true));
    }, []);

    useEffect(() => {
        if (from) localStorage.setItem("from", from);
    }, [from]);
    useEffect(() => {
        if (to) localStorage.setItem("to", to);
    }, [to]);
    useEffect(() => {
        localStorage.setItem("amount", amount);
    }, [amount]);

    const amountNum = parseFloat(amount) || 0;

    const result = useMemo(
        () => (rates ? convertAmount(amountNum, from, to, rates) : NaN),
        [rates, amountNum, from, to],
    );
    const unitRate = useMemo(
        () => (rates ? convertAmount(1, from, to, rates) : NaN),
        [rates, from, to],
    );
    const inverseRate = useMemo(
        () => (rates ? convertAmount(1, to, from, rates) : NaN),
        [rates, from, to],
    );

    const codes = useMemo(() => {
        if (!rates) return [];
        // Surface known currencies first; still allow any code the API returns.
        return Object.keys(rates);
    }, [rates]);

    const selectCurrency = (code: string) => {
        // If the chosen code is already on the other side, swap to avoid from === to.
        if (picker === "from") {
            if (code === to) setTo(from);
            setFrom(code);
        } else if (picker === "to") {
            if (code === from) setFrom(to);
            setTo(code);
        }
        setPicker(null);
    };

    const swap = () => {
        setFrom(to);
        setTo(from);
    };

    if (error) {
        return (
            <div className="card converter converter--state">
                <p className="converter__error">
                    Couldn’t load live rates. Make sure the backend is running and the
                    <code> API_URL</code> / <code>API_KEY</code> are configured.
                </p>
            </div>
        );
    }

    if (!rates) {
        return (
            <div className="card converter converter--state">
                <div className="converter__loading">
                    <span className="converter__spinner" />
                    Fetching live rates…
                </div>
            </div>
        );
    }

    const hasResult = from && to && amountNum > 0;

    return (
        <div className="converter-shell">
            <div className="card converter">
                <div className="converter__selectors">
                    <CurrencyButton
                        label="From"
                        code={from}
                        active={picker === "from"}
                        onClick={() => setPicker("from")}
                    />
                    <button type="button" className="converter__swap" onClick={swap} aria-label="Swap currencies">
                        <HiArrowsRightLeft />
                    </button>
                    <CurrencyButton
                        label="To"
                        code={to}
                        active={picker === "to"}
                        onClick={() => setPicker("to")}
                    />
                </div>

                <Input value={amount} onChange={setAmount} symbol={symbolFor(from)} code={from} />

                <div className="converter__result">
                    <span className="converter__result-label">Converted amount</span>
                    <div className="converter__result-value">
                        <span className="converter__result-symbol">{symbolFor(to)}</span>
                        <span className="converter__result-number">
                            {hasResult ? formatMoney(result) : "0.00"}
                        </span>
                        <span className="converter__result-code">{to}</span>
                    </div>
                    {from && to && (
                        <div className="converter__rate-line">
                            <span>1 {from} = {formatRate(unitRate)} {to}</span>
                            <span className="converter__rate-dot">•</span>
                            <span>1 {to} = {formatRate(inverseRate)} {from}</span>
                        </div>
                    )}
                </div>

                <RateTrend from={from} to={to} />
            </div>

            <div className="card converter__markets">
                <Markets rates={rates} from={from} to={to} amount={amountNum} />
            </div>

            {picker && (
                <CurrencyPicker
                    title={picker === "from" ? "Convert from" : "Convert to"}
                    codes={codes}
                    selected={picker === "from" ? from : to}
                    onSelect={selectCurrency}
                    onClose={() => setPicker(null)}
                />
            )}
        </div>
    );
}
