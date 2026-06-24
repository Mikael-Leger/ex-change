// Currency metadata: ISO code -> display name, flag emoji and symbol.
// Covers the freecurrencyapi.com supported set (plus a few extras). Any code
// not listed here still renders gracefully via `flagFor` / `nameFor` fallbacks.

export interface CurrencyMeta {
    name: string;
    flag: string;
    symbol: string;
}

export const CURRENCIES: Record<string, CurrencyMeta> = {
    AUD: { name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
    BGN: { name: "Bulgarian Lev", flag: "🇧🇬", symbol: "лв" },
    BRL: { name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
    CAD: { name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
    CHF: { name: "Swiss Franc", flag: "🇨🇭", symbol: "Fr" },
    CNY: { name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
    CZK: { name: "Czech Koruna", flag: "🇨🇿", symbol: "Kč" },
    DKK: { name: "Danish Krone", flag: "🇩🇰", symbol: "kr" },
    EUR: { name: "Euro", flag: "🇪🇺", symbol: "€" },
    GBP: { name: "British Pound", flag: "🇬🇧", symbol: "£" },
    HKD: { name: "Hong Kong Dollar", flag: "🇭🇰", symbol: "HK$" },
    HRK: { name: "Croatian Kuna", flag: "🇭🇷", symbol: "kn" },
    HUF: { name: "Hungarian Forint", flag: "🇭🇺", symbol: "Ft" },
    IDR: { name: "Indonesian Rupiah", flag: "🇮🇩", symbol: "Rp" },
    ILS: { name: "Israeli New Shekel", flag: "🇮🇱", symbol: "₪" },
    INR: { name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
    ISK: { name: "Icelandic Króna", flag: "🇮🇸", symbol: "kr" },
    JPY: { name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
    KRW: { name: "South Korean Won", flag: "🇰🇷", symbol: "₩" },
    MXN: { name: "Mexican Peso", flag: "🇲🇽", symbol: "$" },
    MYR: { name: "Malaysian Ringgit", flag: "🇲🇾", symbol: "RM" },
    NOK: { name: "Norwegian Krone", flag: "🇳🇴", symbol: "kr" },
    NZD: { name: "New Zealand Dollar", flag: "🇳🇿", symbol: "NZ$" },
    PHP: { name: "Philippine Peso", flag: "🇵🇭", symbol: "₱" },
    PLN: { name: "Polish Złoty", flag: "🇵🇱", symbol: "zł" },
    RON: { name: "Romanian Leu", flag: "🇷🇴", symbol: "lei" },
    RUB: { name: "Russian Ruble", flag: "🇷🇺", symbol: "₽" },
    SEK: { name: "Swedish Krona", flag: "🇸🇪", symbol: "kr" },
    SGD: { name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
    THB: { name: "Thai Baht", flag: "🇹🇭", symbol: "฿" },
    TRY: { name: "Turkish Lira", flag: "🇹🇷", symbol: "₺" },
    USD: { name: "US Dollar", flag: "🇺🇸", symbol: "$" },
    ZAR: { name: "South African Rand", flag: "🇿🇦", symbol: "R" },
    AED: { name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
    SAR: { name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
};

// Currencies highlighted in the multi-currency "Markets" panel, in order.
export const POPULAR: string[] = [
    "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR",
];

// Map a currency code to an ISO 3166-1 alpha-2 country code (lowercase) for
// flag images. For most codes the first two letters are the country (USD->us,
// GBP->gb); a few need an explicit mapping.
const COUNTRY_OVERRIDES: Record<string, string> = {
    EUR: "eu",
    XOF: "un", XAF: "un", XCD: "un", XPF: "un", // multi-country -> neutral flag
};

export function countryFor(code: string): string {
    if (COUNTRY_OVERRIDES[code]) return COUNTRY_OVERRIDES[code];
    const cc = code.slice(0, 2).toLowerCase();
    return /^[a-z]{2}$/.test(cc) ? cc : "un";
}

// flagcdn.com serves crisp SVG/PNG flags for every ISO country, so flags look
// identical across Windows/macOS/Linux (unlike emoji flags, unsupported on Windows).
export function flagUrl(code: string): string {
    return `https://flagcdn.com/${countryFor(code)}.svg`;
}

// Derive a flag emoji from a currency code's leading country letters.
// Used as a graceful fallback if the flag image fails to load.
export function flagFor(code: string): string {
    const known = CURRENCIES[code];
    if (known) return known.flag;
    const country = code.slice(0, 2).toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) return "🏳️";
    const A = 0x1f1e6;
    return String.fromCodePoint(
        A + country.charCodeAt(0) - 65,
        A + country.charCodeAt(1) - 65,
    );
}

export function nameFor(code: string): string {
    return CURRENCIES[code]?.name ?? code;
}

export function symbolFor(code: string): string {
    return CURRENCIES[code]?.symbol ?? "";
}
