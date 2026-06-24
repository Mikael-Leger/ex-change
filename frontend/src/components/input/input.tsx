import "./input.scss";

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    symbol: string;
    code: string;
}

// Amount field — a large, friendly decimal input with the source currency
// symbol as a prefix and the code as a suffix chip.
export default function Input({ value, onChange, symbol, code }: InputProps) {
    const sanitize = (raw: string) => {
        // Allow only digits and a single decimal point.
        const cleaned = raw.replace(/[^\d.]/g, "");
        const parts = cleaned.split(".");
        return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    };

    return (
        <label className="input">
            <span className="input__label">Amount</span>
            <span className="input__field">
                <span className="input__symbol">{symbol}</span>
                <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => onChange(sanitize(e.target.value))}
                />
                <span className="input__code">{code}</span>
            </span>
        </label>
    );
}
