import Convert from './components/convert/convert'

import './App.scss';
import { useEffect, useState } from 'react';

function App() {
    const [apiUrl, setApiUrl] = useState<string>();

    useEffect(() => {
        fetchApiUrl();
    }, []);

    const fetchApiUrl = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://127.0.0.1:5000/api', requestOptions)
            .then(response => response.json())
            .then(json => {
                setApiUrl("API: " + json.api_url);
            });
    }

    return (
        <div className='App'>
            <div className='App-title'>
                <div className='App-title-1'>EX</div>
                <div className='App-title-2'>change</div>
            </div>
            <Convert/>
            <div className='App-footer'>
                {apiUrl && (
                    <div>
                        <div>{apiUrl}</div>
                        <div>Author: @Mikael-Leger</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
