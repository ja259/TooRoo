import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid, Paper, Typography, Avatar, Button, Select, MenuItem, TextField, Rating
} from '@mui/material';
import { FaMoneyBillWave, FaClock, FaStar } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Salon.css';

const Salon = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedStylist, setSelectedStylist] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servicesResponse = await axios.get('http://localhost:5000/api/services');
                const stylistsResponse = await axios.get('http://localhost:5000/api/stylists');
                const reviewsResponse = await axios.get('http://localhost:5000/api/reviews');
                setServices(servicesResponse.data);
                setStylists(stylistsResponse.data);
                setReviews(reviewsResponse.data);
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleBooking = async () => {
        if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
            setError('Please fill in all the fields');
            return;
        }

        const newAppointment = {
            service: selectedService,
            stylist: selectedStylist,
            date: selectedDate,
            time: selectedTime,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/appointments', newAppointment);
            setAppointments([...appointments, response.data]);
            setError('');
            // Additional success handling like showing a success message or redirecting
        } catch (err) {
            setError('Failed to book appointment');
        }
    };

    return (
        <Grid container spacing={3} className="salon-container">
            <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>Salon & Barber Shop</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="booking-form" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Book an Appointment</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Select Date"
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Select Time"
                                    value={selectedTime}
                                    onChange={(time) => setSelectedTime(time)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    value={selectedStylist}
                                    onChange={(e) => setSelectedStylist(e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value="" disabled>Select Stylist</MenuItem>
                                    {stylists.map(stylist => (
                                        <MenuItem key={stylist.id} value={stylist.id}>{stylist.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value="" disabled>Select Service</MenuItem>
                                    {services.map(service => (
                                        <MenuItem key={service.id} value={service.id}>{service.name} - ${service.price}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleBooking}>Book Appointment</Button>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="services" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Our Services</Typography>
                    {services.map(service => (
                        <div key={service.id} className="service">
                            <Typography variant="h6">{service.name}</Typography>
                            <Typography>{service.description}</Typography>
                            <Typography><FaMoneyBillWave /> ${service.price}</Typography>
                            <Typography><FaClock /> {service.duration} min</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className="stylists" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Our Stylists</Typography>
                    <Grid container spacing={2}>
                        {stylists.map(stylist => (
                            <Grid item xs={12} md={4} key={stylist.id}>
                                <Paper className="stylist" elevation={2}>
                                    <Avatar src={stylist.photo} className="avatar" />
                                    <Typography variant="h6">{stylist.name}</Typography>
                                    <Typography>{stylist.bio}</Typography>
                                    <Rating value={stylist.rating} readOnly />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className="reviews" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Customer Reviews</Typography>
                    {reviews.map(review => (
                        <div key={review.id} className="review">
                            <Typography variant="body1">{review.user}</Typography>
                            <Typography variant="body2">{review.comment}</Typography>
                            <Rating value={review.rating} readOnly />
                        </div>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Salon;
