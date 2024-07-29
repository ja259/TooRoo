import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid, Paper, Typography, Button, TextField, Avatar, IconButton, Select, MenuItem, InputAdornment
} from '@mui/material';
import {
    FaWallet, FaMoneyBillWave, FaChartLine, FaGift, FaReceipt, FaBell, FaLock, FaQrcode, FaFingerprint
} from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Wallet.css';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [addFundsAmount, setAddFundsAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const [currency, setCurrency] = useState('USD');
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);

    useEffect(() => {
        // Fetch wallet data
        const fetchWalletData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/wallet');
                setBalance(response.data.balance);
                setTransactionHistory(response.data.transactionHistory);
                setUser(response.data.user);
                setCurrency(response.data.currency);
                setExpenses(response.data.expenses);
                setNotifications(response.data.notifications);
                setLoyaltyPoints(response.data.loyaltyPoints);
            } catch (err) {
                setError('Failed to fetch wallet data');
            }
        };
        fetchWalletData();
    }, []);

    const handleAddFunds = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/add-funds', { amount: addFundsAmount });
            setBalance(response.data.newBalance);
            setTransactionHistory([...transactionHistory, response.data.transaction]);
            setAddFundsAmount('');
        } catch (err) {
            setError('Failed to add funds');
        }
    };

    const handleTransfer = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/transfer', { amount: transferAmount, recipient });
            setBalance(response.data.newBalance);
            setTransactionHistory([...transactionHistory, response.data.transaction]);
            setTransferAmount('');
            setRecipient('');
        } catch (err) {
            setError('Failed to transfer funds');
        }
    };

    return (
        <Grid container spacing={3} className="wallet-container">
            <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>Wallet</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="wallet-balance" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Balance</Typography>
                    <Typography variant="h4" component="p">{currency} {balance.toFixed(2)}</Typography>
                    <TextField
                        label="Add Funds"
                        value={addFundsAmount}
                        onChange={(e) => setAddFundsAmount(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><FaMoneyBillWave /></InputAdornment>,
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddFunds} fullWidth>Add Funds</Button>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="wallet-transfer" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Transfer Funds</Typography>
                    <TextField
                        label="Amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><FaMoneyBillWave /></InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleTransfer} fullWidth>Transfer</Button>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className="transaction-history" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Transaction History</Typography>
                    {transactionHistory.map((transaction, index) => (
                        <div key={index} className="transaction">
                            <Typography variant="body1">{transaction.date} - {currency} {transaction.amount.toFixed(2)}</Typography>
                            <Typography variant="body2">{transaction.description}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="expenses" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Expenses</Typography>
                    {expenses.map((expense, index) => (
                        <div key={index} className="expense">
                            <Typography variant="body1">{expense.category}: {currency} {expense.amount.toFixed(2)}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper className="budget" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Budget</Typography>
                    <TextField
                        label="Set Monthly Budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><FaChartLine /></InputAdornment>,
                        }}
                    />
                    <Button variant="contained" color="primary" fullWidth>Set Budget</Button>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className="notifications" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Notifications</Typography>
                    {notifications.map((notification, index) => (
                        <div key={index} className="notification">
                            <Typography variant="body1">{notification.message}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className="loyalty" elevation={3}>
                    <Typography variant="h6" component="h2" gutterBottom>Loyalty Points</Typography>
                    <Typography variant="h4" component="p">{loyaltyPoints} points</Typography>
                    <Button variant="contained" color="primary" fullWidth>Redeem Points</Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Wallet;
