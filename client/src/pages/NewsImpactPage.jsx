import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const NewsImpactPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newsData, setNewsData] = useState([]);

  // Fetch news impact data on component mount
  useEffect(() => {
    fetchNewsImpact();
  }, []);

  const fetchNewsImpact = async () => {
    const baseURL = 'http://localhost:8080';
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseURL}/stocks/news/3day-reaction`);

      if (!response.ok) {
        throw new Error('Failed to fetch news impact data');
      }

      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      setError('Failed to load news impact data. Please try again.');
      console.error('Error fetching news impact:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get color based on sentiment score
  const getSentimentColor = (score) => {
    if (score < -0.5) return 'error';
    if (score < -0.3) return 'warning';
    return 'default';
  };

  // Get color based on price change
  const getPriceChangeColor = (change) => {
    if (change < -5) return 'error.main';
    if (change < 0) return 'warning.main';
    return 'success.main';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
          <NewspaperIcon sx={{ fontSize: 40 }} color="primary" />
          <Typography variant="h4" component="h1">
            News Impact Analysis
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Bearish news and their 3-day stock price impact (Last 30 days)
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* News Impact Table */}
      {!loading && !error && newsData.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingDownIcon color="error" />
              <Typography variant="h6">
                Top {newsData.length} Bearish News Events
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Company</strong></TableCell>
                    <TableCell><strong>News Title</strong></TableCell>
                    <TableCell align="center"><strong>Date</strong></TableCell>
                    <TableCell align="center"><strong>Sentiment</strong></TableCell>
                    <TableCell align="right"><strong>Price at News</strong></TableCell>
                    <TableCell align="right"><strong>Price 3d Later</strong></TableCell>
                    <TableCell align="right"><strong>Change (%)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newsData.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { backgroundColor: 'grey.50' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.company_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 400 }}>
                          {item.news_title}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(item.news_date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.sentiment_score ? parseFloat(item.sentiment_score).toFixed(2) : 'N/A'}
                          color={getSentimentColor(item.sentiment_score)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${item.price_at_news ? parseFloat(item.price_at_news).toFixed(2) : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${item.price_3days_later ? parseFloat(item.price_3days_later).toFixed(2) : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={getPriceChangeColor(item.price_change_pct)}
                        >
                          {item.price_change_pct > 0 ? '+' : ''}
                          {item.price_change_pct ? parseFloat(item.price_change_pct).toFixed(2) : 'N/A'}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {!loading && !error && newsData.length === 0 && (
        <Alert severity="info">
          No bearish news data available for the last 30 days.
        </Alert>
      )}
    </Container>
  );
};

export default NewsImpactPage;
