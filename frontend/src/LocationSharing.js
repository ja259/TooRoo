import React, { useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import './LocationSharing.css';

const LocationSharing = () => {
    const [location, setLocation] = useState(null);

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            }, (error) => {
                console.error('Error fetching location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="location-sharing">
            <h2>Share Your Location</h2>
            <button onClick={handleShareLocation}><FaLocationArrow /> Share Location</button>
            {location && (
                <div className="location-details">
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
        </div>
    );
};

export default LocationSharing;
