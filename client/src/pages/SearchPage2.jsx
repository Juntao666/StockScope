import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StockCard from '../components/StockCard';

const SearchPage2 = () => {
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [metric, setMetric] = useState('priceIncrease');
  const [topK, setTopK] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const metricOptions = [
    { value: 'priceIncrease', label: 'Highest Price Increase (%)' },
    { value: 'currentPrice', label: 'Highest Price Per Share ($)' },
    { value: 'sentimentScore', label: 'Highest Sentiment Score' },
  ];

  const fetchTopStocks = async (start, end, metricType, k) => {
    const baseURL = 'http://localhost:8080';

    // Convert YYYY-MM-DD dates to timestamps (milliseconds)
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    try {
      let response;
      let data;

      // Route to appropriate endpoint based on metric type
      switch (metricType) {
        case 'priceIncrease':
          // Note: /gain endpoint returns top 10 from latest date only
          // Does not support custom date ranges or K parameter
          response = await fetch(`${baseURL}/gain`);
          if (!response.ok) throw new Error('Failed to fetch gain data');
          data = await response.json();

          // Transform data: {code, percentage, close, company} -> {symbol, name, priceIncrease}
          return {
            stocks: data.slice(0, k).map(item => ({
              symbol: item.code,
              name: item.company || item.code,
              priceIncrease: item.percentage,
              currentPrice: item.close
            })),
            metric: metricType,
            period: { start, end },
            count: Math.min(data.length, k),
          };

        case 'currentPrice':
          response = await fetch(`${baseURL}/intervalCloseK?start=${startTimestamp}&end=${endTimestamp}&k=${k}`);
          if (!response.ok) throw new Error('Failed to fetch price data');
          data = await response.json();

          // Transform data: {code, avg_close} -> {symbol, name, currentPrice}
          return {
            stocks: data.map(item => ({
              symbol: item.code,
              name: item.code, // Backend doesn't return company name for this endpoint
              currentPrice: item.avg_close
            })),
            metric: metricType,
            period: { start, end },
            count: data.length,
          };

        case 'sentimentScore':
          response = await fetch(`${baseURL}/stocks/rankings/highest-sentiment?start=${startTimestamp}&end=${endTimestamp}&k=${k}`);
          if (!response.ok) throw new Error('Failed to fetch sentiment data');
          data = await response.json();

          // Transform data: {code, sentiment_score, sentiment_level} -> {symbol, name, sentimentScore}
          return {
            stocks: data.map(item => ({
              symbol: item.code,
              name: item.code, // Backend doesn't return company name for this endpoint
              sentimentScore: item.sentiment_score,
              sentimentLevel: item.sentiment_level
            })),
            metric: metricType,
            period: { start, end },
            count: data.length,
          };

        default:
          throw new Error('Invalid metric type');
      }
    } catch (error) {
      console.error('Error fetching top stocks:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    // Validation
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }
    if (topK < 1 || topK > 50) {
      setError('Please enter a value between 1 and 50 for top K stocks');
      return;
    }

    setError('');
    setLoading(true);
    setSearchResults(null);

    try {
      const data = await fetchTopStocks(startDate, endDate, metric, topK);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMetricLabel = (metricType) => {
    const option = metricOptions.find(opt => opt.value === metricType);
    return option ? option.label : '';
  };

  const formatMetricValue = (value, metricType) => {
    switch (metricType) {
      case 'priceIncrease':
        return `+${value.toFixed(2)}%`;
      case 'currentPrice':
        return `$${value.toFixed(2)}`;
      case 'sentimentScore':
        return value.toFixed(2);
      default:
        return value;
    }
  };

  const getMetricColor = (value, metricType) => {
    if (metricType === 'priceIncrease') {
      return value > 0 ? 'success.main' : 'error.main';
    } else if (metricType === 'sentimentScore') {
      return value > 0.7 ? 'success.main' : value > 0.5 ? 'warning.main' : 'error.main';
    }
    return 'primary.main';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Top Stocks Query
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find top K stocks by price increase, price per share, or sentiment score
        </Typography>
      </Box>

      {/* Search Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={metric}
                  label="Metric"
                  onChange={(e) => setMetric(e.target.value)}
                >
                  {metricOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Top K"
                type="number"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value) || 0)}
                inputProps={{ min: 1, max: 50 }}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? '' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {searchResults && (
        <Box>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Top {searchResults.count} Stocks - {getMetricLabel(searchResults.metric)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Period: {searchResults.period.start} to {searchResults.period.end}
            </Typography>
          </Box>

          {/* Flex Layout with Fixed Card Width */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'flex-start',
            }}
          >
            {searchResults.stocks.map((stock, index) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                index={index}
                metric={searchResults.metric}
                formatMetricValue={formatMetricValue}
                getMetricColor={getMetricColor}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage2;
