import React, { useEffect, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress,
    Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import config from '../config.json';

const RandomStocksPage = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRandomStocks = () => {
        setLoading(true);
        fetch(`http://${config.server_host}:${config.server_port}/random`)
            .then(res => res.json())
            .then(resJson => {
                setStocks(resJson);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching random stocks:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRandomStocks();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const calculateChange = (open, close) => {
        const change = ((close - open) / open * 100).toFixed(2);
        return parseFloat(change);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    🎲 Random 10 Stocks
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={fetchRandomStocks}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            <Typography variant="body1" color="textSecondary" gutterBottom>
                Displaying 10 randomly selected stocks with their latest trading data
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Stock Code</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell align="right"><strong>Open</strong></TableCell>
                                <TableCell align="right"><strong>High</strong></TableCell>
                                <TableCell align="right"><strong>Low</strong></TableCell>
                                <TableCell align="right"><strong>Close</strong></TableCell>
                                <TableCell align="center"><strong>Daily Change</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((stock, index) => {
                                const change = calculateChange(stock.open, stock.close);
                                return (
                                    <TableRow 
                                        key={`${stock.code}-${index}`}
                                        hover
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <Typography 
                                                variant="body1" 
                                                style={{ 
                                                    fontWeight: 'bold',
                                                    color: '#1976d2' 
                                                }}
                                            >
                                                {stock.code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatDate(stock.date)}</TableCell>
                                        <TableCell align="right">{formatPrice(stock.open)}</TableCell>
                                        <TableCell align="right">
                                            <span style={{ color: '#4caf50', fontWeight: '500' }}>
                                                {formatPrice(stock.high)}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <span style={{ color: '#f44336', fontWeight: '500' }}>
                                                {formatPrice(stock.low)}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>{formatPrice(stock.close)}</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${change > 0 ? '+' : ''}${change}%`}
                                                color={change > 0 ? 'success' : change < 0 ? 'error' : 'default'}
                                                size="small"
                                                style={{ 
                                                    fontWeight: 'bold',
                                                    minWidth: '70px'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {!loading && stocks.length === 0 && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                    marginTop="20px"
                >
                    <Typography variant="h6" color="textSecondary">
                        No stock data available
                    </Typography>
                </Box>
            )}

            <Box marginTop="30px" padding="20px" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    📊 Understanding the Data
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>Open:</strong> The price at which the stock started trading
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>High:</strong> The highest price reached during the trading day
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>Low:</strong> The lowest price reached during the trading day
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>Close:</strong> The final price at market close
                </Typography>
                <Typography variant="body2">
                    <strong>Daily Change:</strong> Percentage change from Open to Close price
                </Typography>
            </Box>
        </Container>
    );
};

export default RandomStocksPage;
