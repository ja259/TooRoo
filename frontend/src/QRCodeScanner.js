import React, { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import QrReader from 'react-qr-scanner'; // Use react-qr-scanner instead of react-qr-reader
import './QRCodeScanner.css';

const QRCodeScanner = () => {
    const [result, setResult] = useState('No result');

    const handleScan = (data) => {
        if (data) {
            setResult(data.text); // Update to handle data.text for react-qr-scanner
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div className="qr-code-scanner">
            <h2>QR Code Scanner <FaQrcode /></h2>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={previewStyle}
            />
            <p>{result}</p>
        </div>
    );
};

export default QRCodeScanner;
