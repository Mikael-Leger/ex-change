import { HiChevronDown } from "react-icons/hi2";

import Flag from "../flag/flag";
import { nameFor } from "../../data/currencies";

import "./currency-button.scss";

interface CurrencyButtonProps {
    label: string;
    code: string;
    active: boolean;
    onClick: () => void;
}

export default function CurrencyButton({ label, code, active, onClick }: CurrencyButtonProps) {
    return (
        <button
            type="button"
            className={`currency-button ${active ? "is-active" : ""}`}
            onClick={onClick}
        >
            <span className="currency-button__label">{label}</span>
            <span className="currency-button__main">
                <span className="currency-button__flag"><Flag code={code} size={38} /></span>
                <span className="currency-button__text">
                    <span className="currency-button__code">{code || "Select"}</span>
                    <span className="currency-button__name">{code ? nameFor(code) : "Pick a currency"}</span>
                </span>
                <HiChevronDown className="currency-button__chevron" />
            </span>
        </button>
    );
}
