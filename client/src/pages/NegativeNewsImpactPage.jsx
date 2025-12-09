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
    Typography,
    Box,
    CircularProgress,
    Chip,
    Card,
    CardContent,
    Grid,
    Tooltip,
    Alert,
    LinearProgress,
} from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import config from '../config.json';

const NegativeNewsImpactPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');

        fetch(`http://${config.server_host}:${config.server_port}/stocks/news/negative-impact`)
            .then(res => res.json())
            .then(resJson => {
                if (resJson.error) {
                    setError(resJson.error);
                    setEvents([]);
                } else {
                    setEvents(resJson);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching negative news impact:', error);
                setError('Failed to fetch data. Please try again.');
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getSentimentSeverity = (score) => {
        if (score <= -0.7) return { color: '#b71c1c', label: 'Extremely Bearish' };
        if (score <= -0.5) return { color: '#d32f2f', label: 'Very Bearish' };
        return { color: '#f44336', label: 'Bearish' };
    };

    const getDropSeverity = (percentage) => {
        if (percentage <= -15) return { color: '#b71c1c', label: 'Severe Drop', icon: '🔻' };
        if (percentage <= -10) return { color: '#d32f2f', label: 'Major Drop', icon: '⬇️' };
        if (percentage <= -7) return { color: '#f44336', label: 'Significant Drop', icon: '📉' };
        return { color: '#ff5252', label: 'Moderate Drop', icon: '↘️' };
    };

    return (
        <Container maxWidth="xl" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Box display="flex" alignItems="center" marginBottom="10px">
                <WarningAmberIcon style={{ fontSize: '2.5rem', marginRight: '10px', color: '#d32f2f' }} />
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 'bold',
                        color: '#d32f2f',
                    }}
                >
                    ⚠️ Negative News & Price Drop Impact
                </Typography>
            </Box>

            <Typography variant="body1" color="textSecondary" gutterBottom style={{ marginBottom: '20px' }}>
                Analyzing how negative news sentiment correlates with significant stock price declines
            </Typography>

            {/* Statistics Summary */}
            {!loading && events.length > 0 && (
                <Grid container spacing={2} marginBottom="30px">
                    <Grid item xs={12} sm={3}>
                        <Card elevation={3} style={{ backgroundColor: '#ffebee' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                    {events.length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Events Detected
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card elevation={3} style={{ backgroundColor: '#fce4ec' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#c2185b' }}>
                                    {Math.min(...events.map(e => e.three_day_return)).toFixed(2)}%
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Worst 3-Day Drop
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card elevation={3} style={{ backgroundColor: '#f3e5f5' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                                    {(events.reduce((sum, e) => sum + e.three_day_return, 0) / events.length).toFixed(2)}%
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Average Drop
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card elevation={3} style={{ backgroundColor: '#e8eaf6' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                    {(events.reduce((sum, e) => sum + e.sentiment_score, 0) / events.length).toFixed(3)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Avg Sentiment Score
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Info Alert */}
            <Alert severity="warning" style={{ marginBottom: '20px' }}>
                <strong>Risk Analysis:</strong> This page shows stocks that experienced significant price drops (≥5%) 
                within 3 days of negative news (sentiment score &lt; -0.3). Use this data to identify potential risks 
                and understand how negative sentiment impacts stock performance.
            </Alert>

            {/* Error Message */}
            {error && (
                <Box marginBottom="20px">
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Loading Spinner */}
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={60} />
                </Box>
            )}

            {/* Results Table */}
            {!loading && events.length > 0 && (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#ffebee' }}>
                            <TableRow>
                                <TableCell><strong>Rank</strong></TableCell>
                                <TableCell><strong>Company</strong></TableCell>
                                <TableCell><strong>News Title</strong></TableCell>
                                <TableCell align="center"><strong>Sentiment</strong></TableCell>
                                <TableCell align="center"><strong>News Date</strong></TableCell>
                                <TableCell align="right"><strong>Start Price</strong></TableCell>
                                <TableCell align="right"><strong>End Price (3d)</strong></TableCell>
                                <TableCell align="center"><strong>3-Day Return</strong></TableCell>
                                <TableCell align="right"><strong>Employees</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event, index) => {
                                const sentimentSeverity = getSentimentSeverity(event.sentiment_score);
                                const dropSeverity = getDropSeverity(event.three_day_return);
                                return (
                                    <TableRow 
                                        key={index}
                                        hover
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: event.three_day_return <= -15 ? '#ffebee' : 
                                                           event.three_day_return <= -10 ? '#fce4ec' : 'transparent',
                                        }}
                                    >
                                        <TableCell>
                                            <Box
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 
                                                        index === 0 ? '#b71c1c' : 
                                                        index === 1 ? '#c62828' : 
                                                        index === 2 ? '#d32f2f' : '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    margin: '0 auto',
                                                    color: index < 3 ? 'white' : 'black',
                                                    boxShadow: index < 3 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: '#1976d2',
                                                }}
                                            >
                                                {event.company_name}
                                            </Typography>
                                            <Chip
                                                label={event.company_code}
                                                size="small"
                                                variant="outlined"
                                                style={{ marginTop: '4px', fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ maxWidth: '300px' }}>
                                            <Box display="flex" alignItems="flex-start">
                                                <NewspaperIcon 
                                                    style={{ 
                                                        marginRight: '8px', 
                                                        color: '#d32f2f',
                                                        fontSize: '1.2rem',
                                                        marginTop: '2px',
                                                    }} 
                                                />
                                                <Tooltip title={event.news_title} arrow>
                                                    <Typography
                                                        variant="body2"
                                                        style={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {event.news_title}
                                                    </Typography>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem',
                                                        color: sentimentSeverity.color,
                                                    }}
                                                >
                                                    {event.sentiment_score.toFixed(3)}
                                                </Typography>
                                                <Typography variant="caption" style={{ color: sentimentSeverity.color }}>
                                                    {sentimentSeverity.label}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {formatDate(event.news_publish_date)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" style={{ fontWeight: '600' }}>
                                                {formatPrice(event.start_price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography 
                                                variant="body2" 
                                                style={{ 
                                                    fontWeight: '600',
                                                    color: '#d32f2f',
                                                }}
                                            >
                                                {formatPrice(event.end_price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box>
                                                <Box
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '8px 12px',
                                                        borderRadius: '16px',
                                                        backgroundColor: dropSeverity.color,
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        marginBottom: '4px',
                                                    }}
                                                >
                                                    <TrendingDownIcon style={{ marginRight: '4px', fontSize: '1rem' }} />
                                                    {event.three_day_return.toFixed(2)}%
                                                </Box>
                                                <Typography 
                                                    variant="caption" 
                                                    display="block"
                                                    style={{ color: dropSeverity.color, fontWeight: 'bold' }}
                                                >
                                                    {dropSeverity.icon} {dropSeverity.label}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={Math.min(Math.abs(event.three_day_return), 20) / 20 * 100}
                                                    style={{
                                                        height: '6px',
                                                        borderRadius: '3px',
                                                        marginTop: '4px',
                                                        backgroundColor: '#ffcdd2',
                                                    }}
                                                    sx={{
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: dropSeverity.color,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="textSecondary">
                                                {event.full_time_employees?.toLocaleString('en-US') || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* No Results Message */}
            {!loading && events.length === 0 && !error && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="300px"
                    marginTop="20px"
                >
                    <Typography variant="h6" color="textSecondary">
                        No negative news impact events detected
                    </Typography>
                </Box>
            )}

            {/* Information Section */}
            <Grid container spacing={3} marginTop="30px">
                <Grid item xs={12} md={6}>
                    <Card elevation={2} style={{ backgroundColor: '#ffebee', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                🔻 Price Drop Severity
                            </Typography>
                            <Box marginTop="10px">
                                <Box display="flex" alignItems="center" marginBottom="8px">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#b71c1c',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Severe Drop (≤-15%):</strong> Critical price decline
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginBottom="8px">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#d32f2f',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Major Drop (-10% to -15%):</strong> Significant loss
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginBottom="8px">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#f44336',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Significant Drop (-7% to -10%):</strong> Notable decline
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#ff5252',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Moderate Drop (-5% to -7%):</strong> Moderate loss
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={2} style={{ backgroundColor: '#e8eaf6', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                📊 Understanding the Data
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Sentiment Score:</strong> Values below -0.3 indicate negative news sentiment
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>3-Day Return:</strong> Price change from news date to 3 days later
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Correlation:</strong> This page only shows events where price dropped ≥5%
                            </Typography>
                            <Typography variant="body2">
                                • <strong>Risk Signal:</strong> Negative news + price drop = strong bearish indicator
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Risk Warning */}
            <Box marginTop="30px">
                <Card elevation={3} style={{ backgroundColor: '#fff3e0', borderLeft: '5px solid #ff9800' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center">
                            <WarningAmberIcon style={{ fontSize: '2rem', marginRight: '10px', color: '#f57c00' }} />
                            <Box>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#e65100' }}>
                                    ⚠️ Investment Warning
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    The events shown represent historical correlations between negative news and price drops. 
                                    Past performance does not guarantee future results. Always conduct thorough research and 
                                    consider multiple factors before making investment decisions.
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default NegativeNewsImpactPage;
