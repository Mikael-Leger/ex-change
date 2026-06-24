// Locale-aware number formatting shared across the converter UI.

const money = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// Rates can be tiny (e.g. 1 USD = 0.0000xx) or large; pick sensible precision.
const rate = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
});

export function formatMoney(value: number): string {
    if (!Number.isFinite(value)) return "—";
    return money.format(value);
}

export function formatRate(value: number): string {
    if (!Number.isFinite(value)) return "—";
    if (value !== 0 && Math.abs(value) < 0.01) {
        // Keep enough significant digits for very small rates.
        return value.toPrecision(3);
    }
    return rate.format(value);
}

export function convertAmount(
    amount: number,
    from: string,
    to: string,
    rates: Record<string, number>,
): number {
    const fromRate = rates[from];
    const toRate = rates[to];
    if (!fromRate || !toRate) return NaN;
    return (amount / fromRate) * toRate;
}
