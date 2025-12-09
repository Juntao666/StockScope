import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Chip,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import config from '../config.json';

const SentimentRankingPage = () => {
    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Calculate default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
    const [endDate, setEndDate] = useState(formatDate(today));
    const [k, setK] = useState(10);
    const [loading, setLoading] = useState(false);
    const [rankings, setRankings] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        setError('');
        setLoading(true);
        setSearched(true);

        try {
            // Convert dates to timestamps
            const startTimestamp = new Date(startDate).getTime();
            const endTimestamp = new Date(endDate).getTime();

            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/stocks/rankings/highest-sentiment?start=${startTimestamp}&end=${endTimestamp}&k=${k}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setRankings(data);
        } catch (err) {
            setError('Failed to fetch sentiment rankings. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentColor = (level) => {
        switch (level) {
            case 'Bullish':
                return 'success';
            case 'Somewhat-Bullish':
                return 'info';
            case 'Neutral':
                return 'default';
            case 'Somewhat-Bearish':
                return 'warning';
            case 'Bearish':
                return 'error';
            default:
                return 'default';
        }
    };

    const getSentimentIcon = (level) => {
        switch (level) {
            case 'Bullish':
                return '📈';
            case 'Somewhat-Bullish':
                return '↗️';
            case 'Neutral':
                return '➡️';
            case 'Somewhat-Bearish':
                return '↘️';
            case 'Bearish':
                return '📉';
            default:
                return '❓';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 0.35) return '#4caf50'; // Green
        if (score >= 0.1) return '#2196f3'; // Blue
        if (score > -0.1) return '#9e9e9e'; // Gray
        if (score > -0.35) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    marginBottom: '10px',
                }}
            >
                📊 Stock Sentiment Rankings
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom style={{ marginBottom: '30px' }}>
                Discover stocks ranked by average sentiment score over a custom date range
            </Typography>

            {/* Search Form */}
            <Card elevation={3} style={{ marginBottom: '30px', padding: '20px' }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Top K Stocks"
                                type="number"
                                value={k}
                                onChange={(e) => setK(Math.max(1, parseInt(e.target.value) || 1))}
                                fullWidth
                                inputProps={{ min: 1, max: 100 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                disabled={loading}
                                style={{ height: '56px' }}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
                <Box marginBottom="20px">
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* Loading Spinner */}
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                </Box>
            )}

            {/* Results Table */}
            {!loading && searched && rankings.length > 0 && (
                <>
                    <Box marginBottom="20px">
                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                            Top {rankings.length} Stocks by Sentiment Score
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Period: {startDate} to {endDate}
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell align="center"><strong>Rank</strong></TableCell>
                                    <TableCell><strong>Stock Code</strong></TableCell>
                                    <TableCell align="center"><strong>Sentiment Score</strong></TableCell>
                                    <TableCell align="center"><strong>Sentiment Level</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rankings.map((stock, index) => (
                                    <TableRow 
                                        key={stock.code}
                                        hover
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: index < 3 ? '#f9f9f9' : 'transparent',
                                        }}
                                    >
                                        <TableCell align="center">
                                            <Box
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    margin: '0 auto',
                                                    color: index < 3 ? 'white' : 'black',
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <TrendingUpIcon style={{ marginRight: '8px', color: '#1976d2' }} />
                                                <Typography
                                                    variant="body1"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem',
                                                        color: '#1976d2',
                                                    }}
                                                >
                                                    {stock.code}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                    color: getScoreColor(stock.sentiment_score),
                                                }}
                                            >
                                                {stock.sentiment_score}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                icon={<span>{getSentimentIcon(stock.sentiment_level)}</span>}
                                                label={stock.sentiment_level}
                                                color={getSentimentColor(stock.sentiment_level)}
                                                style={{ 
                                                    fontWeight: 'bold',
                                                    minWidth: '150px',
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* No Results Message */}
            {!loading && searched && rankings.length === 0 && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                    marginTop="20px"
                >
                    <Typography variant="h6" color="textSecondary">
                        No sentiment data found for the selected period
                    </Typography>
                </Box>
            )}

            {/* Information Card */}
            <Box marginTop="40px">
                <Card elevation={2} style={{ backgroundColor: '#f9f9f9' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                            📚 Understanding Sentiment Levels
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center" marginBottom="10px">
                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>📈</span>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Bullish (≥ 0.35)
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Very positive market sentiment
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" marginBottom="10px">
                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>↗️</span>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Somewhat-Bullish (0.1 to 0.35)
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Positive market sentiment
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>➡️</span>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Neutral (-0.1 to 0.1)
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Balanced market sentiment
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center" marginBottom="10px">
                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>↘️</span>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Somewhat-Bearish (-0.35 to -0.1)
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Negative market sentiment
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>📉</span>
                                    <Box>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                            Bearish (&lt; -0.35)
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Very negative market sentiment
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginTop="20px">
                            <Typography variant="body2" color="textSecondary">
                                💡 <strong>Tip:</strong> Sentiment scores are calculated from news articles mentioning each stock during the selected date range. Higher scores indicate more positive news coverage.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default SentimentRankingPage;
