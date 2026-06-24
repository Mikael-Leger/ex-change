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
            <div className="aurora" aria-hidden="true">
                <span className="aurora__blob aurora__blob--1" />
                <span className="aurora__blob aurora__blob--2" />
                <span className="aurora__blob aurora__blob--3" />
                <span className="aurora__blob aurora__blob--4" />
            </div>
            <div className="grain" aria-hidden="true" />

            <main className="app">
                <header className="app__header">
                    <h1 className="wordmark">
                        <span className="wordmark__ex">EX</span>
                        <span className="wordmark__dot">·</span>
                        <span className="wordmark__change">change</span>
                    </h1>
                    <div className="app__tagline">
                        <span className="live-badge">
                            <span className="live-badge__pulse" />
                            Live
                        </span>
                        Real-time currency conversion
                    </div>
                </header>

                <Convert />

                <footer className="app__footer">
                    {apiUrl && <div>Rates via {prettyHost(apiUrl)}</div>}
                    <div>
                        Crafted by{' '}
                        <a href="https://github.com/Mikael-Leger" target="_blank" rel="noreferrer">
                            @Mikael-Leger
                        </a>
                    </div>
                </footer>
            </main>
        </>
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
