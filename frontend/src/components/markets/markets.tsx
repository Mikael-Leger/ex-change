import { HiPlus, HiXMark } from "react-icons/hi2";

import Flag from "../flag/flag";
import { nameFor, symbolFor } from "../../data/currencies";
import { convertAmount, formatMoney, formatRate } from "../../utils/format";

import "./markets.scss";

interface MarketsProps {
    rates: Record<string, number>;
    from: string;
    to: string;
    amount: number;
    watchlist: string[];
    onAdd: () => void;
    onRemove: (code: string) => void;
    onPick: (code: string) => void;
}

export default function Markets({ rates, from, to, amount, watchlist, onAdd, onRemove, onPick }: MarketsProps) {
    if (!from || !rates[from]) return null;

    const targets = watchlist.filter((code) => code !== from && rates[code]);
    const base = Number.isFinite(amount) && amount > 0 ? amount : 1;

    return (
        <section className="markets">
            <header className="markets__head">
                <div>
                    <h2 className="markets__title">Watchlist</h2>
                    <span className="markets__sub">
                        {symbolFor(from)}{formatMoney(base)} {from} in
                    </span>
                </div>
                <button type="button" className="markets__add" onClick={onAdd}>
                    <HiPlus /> Add
                </button>
            </header>

            <ul className="markets__list">
                {targets.map((code, i) => {
                    const value = convertAmount(base, from, code, rates);
                    const unit = convertAmount(1, from, code, rates);
                    return (
                        <li
                            key={code}
                            className={`markets__row ${code === to ? "is-active" : ""}`}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <button type="button" className="markets__pick" onClick={() => onPick(code)}>
                                <span className="markets__flag"><Flag code={code} size={26} /></span>
                                <span className="markets__meta">
                                    <span className="markets__code">{code}</span>
                                    <span className="markets__name">{nameFor(code)}</span>
                                </span>
                                <span className="markets__values">
                                    <span className="markets__amount">
                                        {symbolFor(code)}{formatMoney(value)}
                                    </span>
                                    <span className="markets__rate">@ {formatRate(unit)}</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="markets__remove"
                                onClick={() => onRemove(code)}
                                aria-label={`Remove ${code}`}
                            >
                                <HiXMark />
                            </button>
                        </li>
                    );
                })}

                {targets.length === 0 && (
                    <li className="markets__empty">Your watchlist is empty.</li>
                )}
            </ul>
        </section>
    );
}
