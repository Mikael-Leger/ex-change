import "./devise.scss";

interface DeviseProps {
    onClick: () => void;
    name: string;
    value: string;
}

export default function Devise({onClick, name, value}: DeviseProps) {
    return <div className="devise" onClick={onClick}>{value != "" ? value : name}</div>
}