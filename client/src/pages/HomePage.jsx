import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const mockData = [
    { symbol: "AAPL", name: "Apple Inc.", gain: 3.45 },
    { symbol: "MSFT", name: "Microsoft Corp.", gain: 2.78 },
    { symbol: "GOOGL", name: "Alphabet Inc.", gain: 1.92 },
    { symbol: "AMZN", name: "Amazon.com Inc.", gain: 4.12 },
    { symbol: "TSLA", name: "Tesla Inc.", gain: 5.67 },
    { symbol: "META", name: "Meta Platforms Inc.", gain: 3.89 },
    { symbol: "NVDA", name: "NVIDIA Corp.", gain: 6.23 },
    { symbol: "NFLX", name: "Netflix Inc.", gain: 2.34 },
    { symbol: "ADBE", name: "Adobe Inc.", gain: 1.56 },
    { symbol: "ORCL", name: "Oracle Corp.", gain: 2.87 }
];

const HomePage = () => {
    const [stocks, setStocks] = useState([]);
    const [mode, setMode] = useState('gainers'); // 'gainers' or 'losers'

    useEffect(() => {
        // Use mock data for development
        if (process.env.NODE_ENV === 'development') {
            setStocks(mockData);
            return;
        }

        // Fetch stocks data based on the current mode
        const fetchStocks = async () => {
            try {
                const response = await fetch(`/api/stocks?mode=${mode}`);
                const data = await response.json();
                setStocks(data);
            } catch (error) {
                console.error("Failed to fetch stocks:", error);
            }
        };

        fetchStocks();
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'gainers' ? 'losers' : 'gainers'));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    fontWeight: 'bold',
                    color: mode === 'gainers' ? 'green' : 'red',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}
            >
                Today's Top 10 {mode === 'gainers' ? 'Gainers' : 'Losers'}
            </Typography>
            <Button variant="contained" color="primary" onClick={toggleMode} style={{ marginBottom: '20px' }}>
                Show {mode === 'gainers' ? 'Losers' : 'Gainers'}
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Symbol</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>{mode === 'gainers' ? 'Gain (%)' : 'Loss (%)'}</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map((stock) => (
                            <TableRow key={stock.symbol}>
                                <TableCell>{stock.symbol}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        color: mode === 'gainers' ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {mode === 'gainers' ? '↑' : '↓'} {stock.gain}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default HomePage;