import Flag from "../flag/flag";
import { nameFor, symbolFor, POPULAR } from "../../data/currencies";
import { convertAmount, formatMoney, formatRate } from "../../utils/format";

import "./markets.scss";

interface MarketsProps {
    rates: Record<string, number>;
    from: string;
    to: string;
    amount: number;
}

export default function Markets({ rates, from, to, amount }: MarketsProps) {
    if (!from || !rates[from]) return null;

    const targets = POPULAR.filter((code) => code !== from && rates[code]);
    if (targets.length === 0) return null;

    const base = Number.isFinite(amount) && amount > 0 ? amount : 1;

    return (
        <section className="markets">
            <header className="markets__head">
                <span className="markets__title">Markets</span>
                <span className="markets__sub">
                    {symbolFor(from)}{formatMoney(base)} {from}
                </span>
            </header>

            <ul className="markets__list">
                {targets.map((code, i) => {
                    const value = convertAmount(base, from, code, rates);
                    const unit = convertAmount(1, from, code, rates);
                    return (
                        <li
                            key={code}
                            className={`markets__row ${code === to ? "is-active" : ""}`}
                            style={{ animationDelay: `${i * 45}ms` }}
                        >
                            <span className="markets__flag"><Flag code={code} size={28} /></span>
                            <span className="markets__meta">
                                <span className="markets__code">{code}</span>
                                <span className="markets__name">{nameFor(code)}</span>
                            </span>
                            <span className="markets__values">
                                <span className="markets__amount">
                                    {symbolFor(code)}{formatMoney(value)}
                                </span>
                                <span className="markets__rate">1 {from} = {formatRate(unit)}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
