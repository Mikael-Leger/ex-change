import { useEffect, useState } from 'react';

import Convert from './components/convert/convert';

import './App.scss';

function App() {
    const [apiUrl, setApiUrl] = useState<string>();

    useEffect(() => {
        fetch('/api', { headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(json => setApiUrl(json.api_url))
            .catch(() => undefined);
    }, []);

    return (
        <>
            <header className="topbar">
                <a className="wordmark" href="/" aria-label="EX·change">
                    <span className="wordmark__mark" aria-hidden="true">€$</span>
                    <span className="wordmark__text">
                        EX<span className="wordmark__dot">·</span>change
                    </span>
                </a>
                <span className="topbar__live">
                    <span className="topbar__pulse" aria-hidden="true" />
                    Live rates
                </span>
            </header>

            <section className="sky">
                <div className="sky__copy">
                    <p className="sky__kicker">Currency converter</p>
                    <h1 className="sky__title">
                        Every currency,
                        <br />
                        at <span className="scribble">today's rate<Scribble /></span>
                    </h1>
                </div>
                <Hills />
            </section>

            <main className="app">
                <Convert />
            </main>

            <footer className="foot">
                <div className="foot__inner">
                    <span className="wordmark wordmark--light">
                        <span>EX<span className="wordmark__dot">·</span>change</span>
                    </span>
                    <span className="foot__meta">
                        {apiUrl && <>Rates via {prettyHost(apiUrl)} · History by the ECB · </>}
                        Built by{' '}
                        <a href="https://github.com/Mikael-Leger" target="_blank" rel="noreferrer">
                            Mikael Léger
                        </a>
                    </span>
                </div>
            </footer>
        </>
    );
}

// The hand-drawn stroke under the headline, drawn in once on load.
function Scribble() {
    return (
        <svg className="scribble__line" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 15 C 70 6, 150 5, 296 11" />
            <path d="M18 20 C 100 13, 190 12, 270 16" />
        </svg>
    );
}

// Layered hills closing the sky, from the far pink ridges to the paper below.
function Hills() {
    return (
        <svg className="hills" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#f7c4c4" d="M0 120 C 180 60 320 70 480 105 C 640 140 760 70 920 62 C 1080 54 1240 110 1440 80 L1440 260 L0 260 Z" />
            <path fill="#c9d3e0" d="M0 150 C 200 110 330 140 520 128 C 700 116 820 92 1000 112 C 1180 132 1300 102 1440 118 L1440 260 L0 260 Z" />
            <path fill="#e98aa0" d="M0 190 C 160 150 300 150 430 170 C 560 190 640 210 760 196 C 880 182 980 150 1120 156 C 1260 162 1350 190 1440 178 L1440 260 L0 260 Z" />
            <path fill="#46557a" d="M0 176 C 120 150 230 160 330 186 C 430 212 520 226 640 214 L640 260 L0 260 Z" />
            <path fill="#2d3452" d="M820 260 C 940 210 1060 168 1200 160 C 1310 154 1390 170 1440 182 L1440 260 Z" />
            <path fill="#faf8f6" d="M0 236 C 240 214 520 222 760 232 C 1000 242 1220 222 1440 214 L1440 260 L0 260 Z" />
        </svg>
    );
}

function prettyHost(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

export default App;
