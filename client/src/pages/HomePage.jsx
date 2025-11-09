import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import config from '../config.json';

const HomePage = () => {
    const [stocks, setStocks] = useState([]);
    const [mode, setMode] = useState('gainers'); // 'gainers' or 'losers'

    useEffect(() => {
        const endpoint = mode === 'gainers' ? 'gain' : 'decline';
        fetch(`http://${config.server_host}:${config.server_port}/${endpoint}`)
            .then(res => res.json())
            .then(resJson => setStocks(resJson));
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
                            <TableCell><strong>Code</strong></TableCell>
                            <TableCell><strong>Company</strong></TableCell>
                            <TableCell align="right"><strong>Close Price</strong></TableCell>
                            <TableCell align="right"><strong>{mode === 'gainers' ? 'Gain (%)' : 'Loss (%)'}</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map((stock) => (
                            <TableRow key={stock.code}>
                                <TableCell>{stock.code}</TableCell>
                                <TableCell>{stock.company}</TableCell>
                                <TableCell align="right">${stock.close}</TableCell>
                                <TableCell
                                    align="right"
                                    style={{
                                        color: mode === 'gainers' ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {mode === 'gainers' ? '↑' : '↓'} {Math.abs(stock.percentage)}%
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