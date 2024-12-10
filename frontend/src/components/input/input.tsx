import "./input.scss";

interface InputProps {
    onChange: (key: "from" | "to" | "amount", value: string) => void;
    name: "from" | "to" | "amount";
    value: string;
    size?: "small" | "big";
}

export default function Input({onChange, name, value, size = "small"}: InputProps) {
    const capitalizeFirstLetter = (text: string): string => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    return (
        <div className={`input ${size}`}>
            <input type="number" placeholder={capitalizeFirstLetter(name)} value={value} onChange={(e) => onChange(name, e.target.value)} />
        </div>
    );
}