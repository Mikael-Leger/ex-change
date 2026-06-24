import { useEffect, useMemo, useRef, useState } from "react";
import { HiMagnifyingGlass, HiXMark, HiCheck } from "react-icons/hi2";

import Flag from "../flag/flag";
import { nameFor } from "../../data/currencies";

import "./currency-picker.scss";

interface CurrencyPickerProps {
    title: string;
    codes: string[];
    selected: string;
    onSelect: (code: string) => void;
    onClose: () => void;
}

export default function CurrencyPicker({ title, codes, selected, onSelect, onClose }: CurrencyPickerProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = [...codes].sort();
        if (!q) return list;
        return list.filter(
            (code) => code.toLowerCase().includes(q) || nameFor(code).toLowerCase().includes(q),
        );
    }, [codes, query]);

    return (
        <div className="picker-overlay" onMouseDown={onClose}>
            <div
                className="picker"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="picker__head">
                    <h2 className="picker__title">{title}</h2>
                    <button type="button" className="picker__close" onClick={onClose} aria-label="Close">
                        <HiXMark />
                    </button>
                </div>

                <div className="picker__search">
                    <HiMagnifyingGlass className="picker__search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search currency or code…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <ul className="picker__list">
                    {filtered.map((code) => (
                        <li key={code}>
                            <button
                                type="button"
                                className={`picker__row ${code === selected ? "is-selected" : ""}`}
                                onClick={() => onSelect(code)}
                            >
                                <span className="picker__flag"><Flag code={code} size={30} /></span>
                                <span className="picker__row-text">
                                    <span className="picker__code">{code}</span>
                                    <span className="picker__name">{nameFor(code)}</span>
                                </span>
                                {code === selected && <HiCheck className="picker__check" />}
                            </button>
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li className="picker__empty">No currency matches “{query}”.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
