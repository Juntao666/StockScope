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
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import WarningIcon from '@mui/icons-material/Warning';
import config from '../config.json';

const NewsVolumeSpikeOage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');

        fetch(`http://${config.server_host}:${config.server_port}/stocks/news/volume-spike`)
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
                console.error('Error fetching news volume spikes:', error);
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

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatVolume = (volume) => {
        if (volume >= 1000000) {
            return `${(volume / 1000000).toFixed(2)}M`;
        } else if (volume >= 1000) {
            return `${(volume / 1000).toFixed(2)}K`;
        }
        return volume.toLocaleString();
    };

    const getSentimentColor = (score) => {
        if (score >= 0.3) return 'success';
        if (score >= 0.1) return 'info';
        if (score >= -0.1) return 'default';
        if (score >= -0.3) return 'warning';
        return 'error';
    };

    const getSentimentLabel = (score) => {
        if (score >= 0.3) return 'Positive';
        if (score >= 0.1) return 'Somewhat Positive';
        if (score >= -0.1) return 'Neutral';
        if (score >= -0.3) return 'Somewhat Negative';
        return 'Negative';
    };

    const getVolumeSpikeSeverity = (ratio) => {
        if (ratio >= 5) return { color: '#d32f2f', label: 'Extreme' };
        if (ratio >= 4) return { color: '#f57c00', label: 'Very High' };
        if (ratio >= 3) return { color: '#fbc02d', label: 'High' };
        return { color: '#388e3c', label: 'Moderate' };
    };

    return (
        <Container maxWidth="xl" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <Box display="flex" alignItems="center" marginBottom="10px">
                <ShowChartIcon style={{ fontSize: '2.5rem', marginRight: '10px', color: '#1976d2' }} />
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    📰 Major News & Volume Spikes
                </Typography>
            </Box>

            <Typography variant="body1" color="textSecondary" gutterBottom style={{ marginBottom: '20px' }}>
                Analyzing major news events that triggered abnormal trading volume spikes
            </Typography>

            {/* Statistics Summary */}
            {!loading && events.length > 0 && (
                <Grid container spacing={2} marginBottom="30px">
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={3} style={{ backgroundColor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    {events.length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Events Detected
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={3} style={{ backgroundColor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#f57c00' }}>
                                    {Math.max(...events.map(e => parseFloat(e.volume_spike_ratio))).toFixed(2)}x
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Highest Volume Spike
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={3} style={{ backgroundColor: '#f3e5f5' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                                    {(events.reduce((sum, e) => sum + parseFloat(e.volume_spike_ratio), 0) / events.length).toFixed(2)}x
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Average Volume Spike
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Info Alert */}
            <Alert severity="info" style={{ marginBottom: '20px' }}>
                <strong>What is a Volume Spike?</strong> A volume spike occurs when trading volume exceeds 2x the 
                30-day average, often triggered by significant news events. Higher ratios indicate stronger market reactions.
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
                        <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Company</strong></TableCell>
                                <TableCell><strong>News Event</strong></TableCell>
                                <TableCell align="center"><strong>Sentiment</strong></TableCell>
                                <TableCell align="center"><strong>News Date</strong></TableCell>
                                <TableCell align="center"><strong>Trading Date</strong></TableCell>
                                <TableCell align="right"><strong>Trading Volume</strong></TableCell>
                                <TableCell align="right"><strong>30d Avg Volume</strong></TableCell>
                                <TableCell align="center"><strong>Spike Ratio</strong></TableCell>
                                <TableCell align="right"><strong>Stock Price</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event, index) => {
                                const spikeSeverity = getVolumeSpikeSeverity(event.volume_spike_ratio);
                                return (
                                    <TableRow 
                                        key={index}
                                        hover
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: event.volume_spike_ratio >= 5 ? '#ffebee' : 'transparent',
                                        }}
                                    >
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
                                        </TableCell>
                                        <TableCell style={{ maxWidth: '300px' }}>
                                            <Box display="flex" alignItems="flex-start">
                                                <NewspaperIcon 
                                                    style={{ 
                                                        marginRight: '8px', 
                                                        color: '#666',
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
                                            <Chip
                                                label={`${getSentimentLabel(event.sentiment_score)} (${parseFloat(event.sentiment_score).toFixed(2)})`}
                                                color={getSentimentColor(event.sentiment_score)}
                                                size="small"
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {formatDateTime(event.news_time)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {formatDate(event.trading_date)}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                ({event.days_from_news} days from news)
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography 
                                                variant="body2" 
                                                style={{ 
                                                    fontWeight: 'bold',
                                                    color: '#1976d2',
                                                }}
                                            >
                                                {formatVolume(event.trading_volume)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="textSecondary">
                                                {formatVolume(event.avg_volume_30d)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '6px 12px',
                                                    borderRadius: '16px',
                                                    backgroundColor: spikeSeverity.color,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {event.volume_spike_ratio >= 5 && (
                                                    <WarningIcon style={{ marginRight: '4px', fontSize: '1rem' }} />
                                                )}
                                                <TrendingUpIcon style={{ marginRight: '4px', fontSize: '1rem' }} />
                                                {parseFloat(event.volume_spike_ratio).toFixed(2)}x
                                            </Box>
                                            <Typography variant="caption" display="block" style={{ marginTop: '4px' }}>
                                                {spikeSeverity.label}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" style={{ fontWeight: '600' }}>
                                                ${parseFloat(event.stock_price).toFixed(2)}
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
                        No volume spike events detected
                    </Typography>
                </Box>
            )}

            {/* Information Section */}
            <Grid container spacing={3} marginTop="30px">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={2} style={{ backgroundColor: '#e8f5e9', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                📊 Volume Spike Levels
                            </Typography>
                            <Box marginTop="10px">
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
                                        <strong>Extreme (≥5x):</strong> Major market-moving event
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginBottom="8px">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#f57c00',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Very High (4-5x):</strong> Significant news impact
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginBottom="8px">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#fbc02d',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>High (3-4x):</strong> Notable market reaction
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Box
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#388e3c',
                                            borderRadius: '4px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <Typography variant="body2">
                                        <strong>Moderate (2-3x):</strong> Moderate news impact
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={2} style={{ backgroundColor: '#fff3e0', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#e65100' }}>
                                💡 Key Insights
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Volume Spikes</strong> indicate heightened market interest and trading activity
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Sentiment Score</strong> shows whether the news is positive or negative
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • <strong>Days from News</strong> shows the time lag between news and volume spike
                            </Typography>
                            <Typography variant="body2">
                                • Events with <strong>extreme spikes</strong> often represent major turning points
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NewsVolumeSpikeOage;
