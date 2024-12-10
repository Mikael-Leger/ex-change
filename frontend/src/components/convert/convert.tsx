import { RefObject, useEffect, useRef, useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";

import Input from "../input/input";
import Devise from "../devise/devise";

import "./convert.scss";

interface Data {
    from: string,
    to: string,
    amount: string
}

export default function Convert() {
    const [rates, setRates] = useState<object>([]);
    const [popupFromVisible, setPopupFromVisible] = useState<boolean>(false);
    const [popupToVisible, setPopupToVisible] = useState<boolean>(false);
    const [data, setData] = useState<Data>({
        from: '',
        to: '',
        amount: ''
    });
    const [result, setResult] = useState("");

    const ref = useRef(null);

    const useOnClickOutside = <T extends HTMLElement>(
        ref: RefObject<T>,
        handler: (event: Event) => void
    ) => {
        useEffect(() => {
            const listener = (event: Event) => {
                if (!ref.current || ref.current.contains(event.target as Node)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        }, [ref, handler]);
    }

    useOnClickOutside(ref, () => {
        if (popupFromVisible) setPopupFromVisible(false);
        if (popupToVisible) setPopupToVisible(false);
    });

    useEffect(() => {
        fetchRates();
    }, []);

    useEffect(() => {
        if (Object.keys(rates).length != 0) {
            getLocalStorageData();
        }
    }, [rates]);

    useEffect(() => {
        const fetchResult = async () => {
            if (data.amount && data.from && data.to) {
                await getResult();
            }
        }
        fetchResult();
    }, [data]);
    
    const fetchRates = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('/rates', requestOptions)
            .then(response => response.json())
            .then(json => {
                setRates(json);
            });
    }

    const getLocalStorageData = () => {
        const localData = { ...data };
        const localAmount = localStorage.getItem('amount');
        if (localAmount) {
            localData.amount = localAmount;
        }
        const localFrom = localStorage.getItem('from');
        if (localFrom) {
            localData.from = localFrom;
        }
        const localTo = localStorage.getItem('to');
        if (localTo) {
            localData.to = localTo;
        }
        setDataAndConvert(localData, false);
    }
    
    const onDataChange = (key: "from" | "to" | "amount", value: string) => {
        const newData: Data = {...data}
        newData[key] = value;
        setDataAndConvert(newData);
    }

    const getResult = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: data.amount, from: data.from, to: data.to, rates })
        };
        fetch('/convert', requestOptions)
            .then(response => response.json())
            .then(json => {
                setResult(`${json.result.toFixed(2)} ${data.to}`);
            });
    }

    const selectDevise = (devise: string) => {
        if (popupFromVisible) {
            const newData = {...data}
            newData.from = devise;
            setDataAndConvert(newData);
            setPopupFromVisible(false);
        } else {
            const newData = {...data}
            newData.to = devise;
            setDataAndConvert(newData);
            setPopupToVisible(false);
        }
    }

    const setDataAndConvert = async (d: Data, setLocal = true) => {
        if (setLocal) {
            localStorage.setItem('amount', d.amount);
            localStorage.setItem('from', d.from);
            localStorage.setItem('to', d.to);
        }
        setData(d);
    }

    const swapDevises = () => {
        const dataSwapped = { ...data };
        dataSwapped.from = data.to;
        dataSwapped.to = data.from;
        setDataAndConvert(dataSwapped);
    }

    const openFromPopup = () => {
        setPopupFromVisible(true);
        setPopupToVisible(false);
    }

    const openToPopup = () => {
        setPopupToVisible(true);
        setPopupFromVisible(false);
    }

    if (rates == null) {
        return <div>Loading</div>;
    }

    return (
        <div className="convert">
            <div className="convert-rates">
                <Devise name="From" value={data.from} onClick={openFromPopup}/>
                <div className="convert-rates-swap" onClick={swapDevises}>
                    <HiArrowsRightLeft />
                </div>
                <Devise name="To" value={data.to} onClick={openToPopup}/>
            </div>
            <div className="convert-amount">
                <Input name="amount" size="big" onChange={onDataChange} value={data.amount}/>
            </div>
            {result && (
            <div className="convert-result">
                {result}
            </div>
            )}
            {(popupFromVisible || popupToVisible) && (
                <div className="convert-popup" ref={ref}>
                {Object.keys(rates).map(rate => {
                    return (<div className="convert-popup-rate" onClick={() => selectDevise(rate)} key={rate}>
                        {rate}
                    </div>);
                })}
            </div>
            )}
        </div>
    );
}