import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VirtualEvents.css';

const VirtualEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/virtual-events');
                setEvents(response.data);
            } catch (error) {
                setError('Error fetching events');
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="virtual-events">
            <h2>Virtual Events and Rooms</h2>
            {events.map((event) => (
                <div key={event._id} className="event">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>Hosted by: {event.host.username}</p>
                </div>
            ))}
        </div>
    );
};

export default VirtualEvents;
